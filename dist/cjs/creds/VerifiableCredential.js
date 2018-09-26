'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const _ = require('lodash');
const MerkleTools = require('merkle-tools');
const sjcl = require('sjcl');
const timestamp = require('unix-timestamp');
const flatten = require('flat');
const definitions = require('./definitions');
const UCA = require('../uca/UserCollectableAttribute');
const SecureRandom = require('../SecureRandom');
const { services } = require('../services');

const anchorService = services.container.AnchorService;

function sha256(string) {
  return sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(string));
}

function getClaimPath(identifier) {
  const identifierComponentes = _.split(identifier, ':');
  const baseName = _.lowerCase(identifierComponentes[1]);
  return `${baseName}.${identifierComponentes[2]}`;
}

function validIdentifiers() {
  const vi = _.map(definitions, d => d.identifier);
  return vi;
}

function getClaimsWithFlatKeys(claims) {
  const flattenDepth3 = flatten(claims, { maxDepth: 3 });
  const flattenDepth2 = flatten(claims, { maxDepth: 2 });
  const flattenClaim = _.merge({}, flattenDepth3, flattenDepth2);
  const flattenSortedKeysClaim = _(flattenClaim).toPairs().sortBy(0).fromPairs().value();
  return flattenSortedKeysClaim;
}

function getLeavesClaimPaths(signLeaves) {
  return _.map(signLeaves, 'claimPath');
}

function verifyLeave(leave, merkleTools, claims, signature, invalidValues, invalidHashs, invalidProofs) {
  // 1. verify valid targetHashs
  // 1.1 "leave.value" should be equal claim values
  const ucaValue = new UCA(leave.identifier, { attestableValue: leave.value });
  if (ucaValue.type === 'String' || ucaValue.type === 'Number') {
    if (ucaValue.value !== _.get(claims, leave.claimPath)) {
      invalidValues.push(leave.value);
    }
  } else if (ucaValue.type === 'Object') {
    const ucaValueValue = ucaValue.value;
    const claimValue = _.get(claims, leave.claimPath);
    // console.log(`${JSON.stringify(ucaValueValue)} / ${JSON.stringify(claimValue)}`);
    const ucaValueKeys = _.keys(ucaValue.value);
    _.each(ucaValueKeys, k => {
      const ucaType = _.get(ucaValueValue[k], 'type');
      // number values are padded on the attestation value
      const expectedClaimValue = ucaType === 'Number' ? _.padStart(claimValue[k], 8, '0') : claimValue[k];
      if (expectedClaimValue && _.get(ucaValueValue[k], 'value') !== expectedClaimValue) {
        invalidValues.push(claimValue[k]);
      }
    });
  } else {
    // Invalid ucaValue.type
    invalidValues.push(leave.value);
  }

  // 1.2 hash(leave.value) should be equal leave.targetHash
  const hash = sha256(leave.value);
  if (hash !== leave.targetHash) invalidHashs.push(leave.targetHash);

  // 2. Validate targetHashs + proofs with merkleRoot
  const isValidProof = merkleTools.validateProof(leave.proof, leave.targetHash, signature.merkleRoot);
  // console.log(`leave.proof / ${leave.targetHash} / ${signature.merkleRoot}: ${isValidProof}`);
  if (!isValidProof) invalidProofs.push(leave.targetHash);
}

/**
 * Transforms a list of UCAs into the signature property of the verifiable cliams
 */
class CivicMerkleProof {
  static get PADDING_INCREMENTS() {
    return 16;
  }

  constructor(ucas) {
    const withRandomUcas = CivicMerkleProof.padTree(ucas);
    this.type = 'CivicMerkleProof2018';
    this.merkleRoot = null;
    this.anchor = 'TBD (Civic Blockchain Attestation)';
    this.leaves = CivicMerkleProof.getAllAttestableValue(withRandomUcas);
    this.buildMerkleTree();
  }

  buildMerkleTree() {
    const merkleTools = new MerkleTools();
    const hashes = _.map(this.leaves, n => sha256(n.value));
    merkleTools.addLeaves(hashes);
    merkleTools.makeTree();
    _.forEach(hashes, (hash, idx) => {
      this.leaves[idx].claimPath = getClaimPath(this.leaves[idx].identifier);
      this.leaves[idx].targetHash = hash;
      this.leaves[idx].proof = merkleTools.getProof(idx);
    });
    this.leaves = _.filter(this.leaves, el => !(el.identifier === 'civ:Random:node'));
    this.merkleRoot = merkleTools.getMerkleRoot().toString('hex');
  }

  static padTree(nodes) {
    const currentLength = nodes.length;
    const targetLength = currentLength < CivicMerkleProof.PADDING_INCREMENTS ? CivicMerkleProof.PADDING_INCREMENTS : _.ceil(currentLength / CivicMerkleProof.PADDING_INCREMENTS) * CivicMerkleProof.PADDING_INCREMENTS;
    const newNodes = _.clone(nodes);
    while (newNodes.length < targetLength) {
      newNodes.push(new UCA('civ:Random:node', SecureRandom.wordWith(16)));
    }
    return newNodes;
  }

  static getAllAttestableValue(ucas) {
    const values = [];
    _.forEach(ucas, uca => {
      const innerValues = uca.getAttestableValues();
      _.reduce(innerValues, (res, iv) => {
        res.push(iv);
        return res;
      }, values);
    });
    return values;
  }
}
/**
 * Transforms a list of UCAs into the claim property of the verifiable cliams
 */
class ClaimModel {
  constructor(ucas) {
    _.forEach(ucas, uca => {
      const rootPropertyName = uca.getClaimRootPropertyName();
      if (!this[rootPropertyName]) {
        this[rootPropertyName] = {};
      }
      this[rootPropertyName][uca.getClaimPropertyName()] = uca.getPlainValue();
    });
  }
}

const VERIFY_LEVELS = {
  INVALID: -1,
  PROOFS: 0, // Includes expiry if its there
  ANCHOR: 1,
  BLOCKCHAIN: 2
};

/**
 * Creates a new Verifiable Credential based on an well-known identifier and it's claims dependencies
 * @param {*} identifier
 * @param {*} issuer
 * @param {*} ucas
 * @param {*} version
 */
function VerifiableCredentialBaseConstructor(identifier, issuer, expiryIn, ucas, version) {
  var _this = this;

  this.id = null;
  this.issuer = issuer;
  const issuerUCA = new UCA('civ:Meta:issuer', this.issuer);
  this.issued = new Date().toISOString();
  const issuedUCA = new UCA('civ:Meta:issued', this.issued);
  this.identifier = identifier;
  this.expiry = expiryIn ? timestamp.toDate(timestamp.now(expiryIn)).toISOString() : null;
  const expiryUCA = new UCA('civ:Meta:expiry', this.expiry ? this.expiry : 'null');

  const proofUCAs = expiryUCA ? _.concat(ucas, issuerUCA, issuedUCA, expiryUCA) : _.concat(ucas, issuerUCA, issuedUCA);

  if (!_.includes(validIdentifiers(), identifier)) {
    throw new Error(`${identifier} is not defined`);
  }

  const definition = version ? _.find(definitions, { identifier, version: `${version}` }) : _.find(definitions, { identifier });
  if (!definition) {
    throw new Error(`Credential definition for ${identifier} v${version} not found`);
  }
  this.version = version || definition.version;
  this.type = ['Credential', identifier];

  // ucas can be empty here if it is been constructed from JSON
  if (!_.isEmpty(ucas)) {
    this.claims = new ClaimModel(ucas);
    this.signature = new CivicMerkleProof(proofUCAs);
    if (!_.isEmpty(definition.excludes)) {
      const removed = _.remove(this.signature.leaves, el => _.includes(definition.excludes, el.identifier));
      _.forEach(removed, r => {
        _.unset(this.claims, r.claimPath);
      });
    }
  }

  /**
   * Returns the global CredentialItemIdentifier of the Credential
   */
  this.getGlobalCredentialItemIdentifier = () => `credential-${this.identifier}-${this.version}`;

  /**
   * Creates a filtered credential exposing only the requested claims
   * @param {*} requestedClaims
   */
  this.filter = requestedClaims => {
    const filtered = _.cloneDeep(this);
    _.remove(filtered.signature.leaves, el => !_.includes(requestedClaims, el.identifier));

    filtered.claims = {};
    _.forEach(filtered.signature.leaves, el => {
      _.set(filtered.claims, el.claimPath, _.get(this.claims, el.claimPath));
    });

    return filtered;
  };

  /**
   * Request that this credential MerkleRoot is anchored on the Blockchain.
   * This will return a _temporary_ anchor meaning that the blockchain entry is still not confirmed.
   * @param {*} options
   */
  this.requestAnchor = (() => {
    var _ref = _asyncToGenerator(function* (options) {
      const anchor = yield anchorService.anchor(_this.identifier, _this.signature.merkleRoot, options);
      _this.signature.anchor = anchor;
      return _this;
    });

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  })();

  /**
   * Trys to renew the current anchor. replecinf the _temporary_ anchor for a _permanent_ one,
   * already confirmed on the blockchain.
   */
  this.updateAnchor = _asyncToGenerator(function* () {
    const anchor = yield anchorService.update(_this.signature.anchor);
    _this.signature.anchor = anchor;
    return _this;
  });

  /**
   * Iterate over all leaves and see if their proofs are valid
   * @returns {boolean}
   */
  this.verifyProofs = () => {
    const expiry = _.clone(this.expiry);
    const claims = _.clone(this.claims);
    const signature = _.clone(this.signature);
    const signLeaves = _.get(signature, 'leaves');
    let valid = false;

    const merkleTools = new MerkleTools();
    const claimsWithFlatKeys = getClaimsWithFlatKeys(claims);
    const leavesClaimPaths = getLeavesClaimPaths(signLeaves);
    const invalidClaim = [];
    const invalidExpiry = [];
    const invalidValues = [];
    const invalidHashs = [];
    const invalidProofs = [];
    _.forEach(_.keys(claimsWithFlatKeys), claimKey => {
      // check if `claimKey` has a `claimPath` proof
      const leaveIdx = _.indexOf(leavesClaimPaths, claimKey);
      // if not found
      if (leaveIdx === -1) {
        // .. still test if parent key node may have a `claimPath` proof
        _.findLastIndex(claimKey, '.');
        const parentClaimKey = claimKey.substring(0, _.lastIndexOf(claimKey, '.'));
        if (_.indexOf(leavesClaimPaths, parentClaimKey) > -1) {
          // if yes, no problem, go to next loop
          return;
        }
        // if no, include on invalidClaim array
        invalidClaim.push(claimKey);
      } else {
        const leave = signLeaves[leaveIdx];
        verifyLeave(leave, merkleTools, claims, signature, invalidValues, invalidHashs, invalidProofs);
      }
    });

    // It has to be present Credential expiry even with null value
    const expiryIdx = _.indexOf(leavesClaimPaths, 'meta.expiry');
    if (expiryIdx >= 0) {
      const expiryLeave = signLeaves[expiryIdx];
      const metaClaim = {
        meta: {
          expiry
        }
      };
      const totalLengthBefore = invalidValues.length + invalidHashs.length + invalidProofs.length;
      verifyLeave(expiryLeave, merkleTools, metaClaim, signature, invalidValues, invalidHashs, invalidProofs);
      const totalLengthAfter = invalidValues.length + invalidHashs.length + invalidProofs.length;
      if (totalLengthAfter === totalLengthBefore) {
        // expiry has always to be string formatted date or null value
        // if it is null it means it's indefinitely
        if (expiry !== null) {
          const now = new Date();
          const expiryDate = new Date(expiry);
          if (now.getTime() > expiryDate.getTime()) {
            invalidExpiry.push(expiry);
          }
        }
      }
    }
    if (_.isEmpty(invalidClaim) && _.isEmpty(invalidValues) && _.isEmpty(invalidHashs) && _.isEmpty(invalidProofs) && _.isEmpty(invalidExpiry)) {
      valid = true;
    }
    return valid;
  };

  /**
   * Verify the Credencial and return a verification level.
   * @return Any of VC.VERIFY_LEVELS
   */
  this.verify = higherVerifyLevel => {
    const hVerifyLevel = higherVerifyLevel || VERIFY_LEVELS.PROOFS;
    let verifiedlevel = VERIFY_LEVELS.INVALID;
    if (hVerifyLevel >= VERIFY_LEVELS.PROOFS && this.verifyProofs()) verifiedlevel = VERIFY_LEVELS.PROOFS;
    return verifiedlevel;
  };

  /**
   * This method checks if the signature matches for the root of the Merkle Tree
   * @return true or false for the validation
   */
  this.verifySignature = _asyncToGenerator(function* () {
    return anchorService.verifySignature(_this.signature);
  });

  /**
   * This method checks that the attestation / anchor exists on the BC
   */
  this.verifyAttestation = _asyncToGenerator(function* () {
    return anchorService.verifyAttestation(_this.signature);
  });

  /**
   * This method will revoke the attestation on the chain
   * @returns {Promise<Promise<*>|void>}
   */
  this.revokeAttestation = _asyncToGenerator(function* () {
    return anchorService.revokeAttestation(_this.signature);
  });

  /**
   * This method will check on the chain the balance of the transaction and if it's still unspent, than it's not revoked
   * @returns {Promise<Promise<*>|void>}
   */
  this.isRevoked = _asyncToGenerator(function* () {
    return anchorService.isRevoked(_this.signature);
  });
  return this;
}

/**
 * Factory function that creates a new Verifiable Credential based on a JSON object
 * @param {*} verifiableCredentialJSON
 */
VerifiableCredentialBaseConstructor.fromJSON = verifiableCredentialJSON => {
  const newObj = new VerifiableCredentialBaseConstructor(verifiableCredentialJSON.identifier, verifiableCredentialJSON.issuer);
  newObj.id = _.clone(verifiableCredentialJSON.id);
  newObj.issued = _.clone(verifiableCredentialJSON.issued);
  newObj.expiry = _.clone(verifiableCredentialJSON.expiry);
  newObj.identifier = _.clone(verifiableCredentialJSON.identifier);
  newObj.version = _.clone(verifiableCredentialJSON.version);
  newObj.type = _.cloneDeep(verifiableCredentialJSON.type);
  newObj.claims = _.cloneDeep(verifiableCredentialJSON.claims);
  newObj.signature = _.cloneDeep(verifiableCredentialJSON.signature);
  return newObj;
};

VerifiableCredentialBaseConstructor.VERIFY_LEVELS = VERIFY_LEVELS;

module.exports = VerifiableCredentialBaseConstructor;