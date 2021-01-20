const { definitions: ucaDefinitions } = require('@identity.com/uca');

// ######################################### DEFINITIONS ###########################################
const definitions = [
  {
    identifier: 'claim-cvc:Email.domain-v1',
    version: '1',
    type: 'cvc:Type:domain',
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Contact.email-v1',
    version: '1',
    type: 'claim-cvc:Type.email-v1',
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:User.id-v1',
    version: '1',
    type: 'String',
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:User.realm-v1',
    version: '1',
    type: 'String',
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Phone.countryCode-v1',
    version: '1',
    type: 'String',
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Phone.number-v1',
    version: '1',
    type: 'String',
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Phone.extension-v1',
    version: '1',
    type: 'String',
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Phone.lineType-v1',
    version: '1',
    type: 'String',
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:PhoneNumber.countryCode-v1',
    type: 'claim-cvc:Phone.countryCode-v1',
    version: '1',
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:PhoneNumber.number-v1',
    type: 'claim-cvc:Phone.number-v1',
    version: '1',
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:PhoneNumber.extension-v1',
    type: 'claim-cvc:Phone.extension-v1',
    version: '1',
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:PhoneNumber.lineType-v1',
    type: 'claim-cvc:Phone.lineType-v1',
    version: '1',
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Contact.phoneNumber-v1',
    version: '1',
    type: 'claim-cvc:Type.phoneNumber-v1',
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Name.givenNames-v1',
    version: '1',
    type: 'String',
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Name.familyNames-v1',
    version: '1',
    type: 'String',
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Name.otherNames-v1',
    version: '1',
    type: 'String',
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Type.Name-v1',
    version: '1',
    type: {
      properties: [
        {
          name: 'givenNames',
          type: 'claim-cvc:Name.givenNames-v1',
        },
        {
          name: 'familyNames',
          type: 'claim-cvc:Name.familyNames-v1',
        },
        {
          name: 'otherNames',
          type: 'claim-cvc:Name.otherNames-v1',
        },
      ],
      required: ['givenNames'],
    },
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Document.name-v1',
    version: '1',
    type: 'claim-cvc:Type.Name-v1',
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Identity.name-v1',
    version: '1',
    type: 'claim-cvc:Type.Name-v1',
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Document.nationality-v1',
    version: '1',
    type: 'String',
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Document.number-v1',
    version: '1',
    type: 'String',
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Identity.dateOfBirth-v1',
    version: '1',
    type: 'cvc:Type:date',
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Address.city-v1',
    version: '1',
    type: 'String',
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Address.postalCode-v1',
    version: '1',
    type: 'String',
    credentialItem: true,
  },

  {
    identifier: 'claim-cvc:Address.state-v1',
    version: '1',
    type: 'String',
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Address.county-v1',
    version: '1',
    type: 'String',
    credentialItem: true,
  },

  {
    identifier: 'claim-cvc:Address.country-v1',
    version: '1',
    type: 'cvc:Type:country',
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Document.address-v1',
    version: '1',
    type: 'claim-cvc:Type.address-v1',
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Identity.address-v1',
    version: '1',
    type: 'claim-cvc:Type.address-v1',
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Document.dateOfIssue-v1',
    version: '1',
    type: 'cvc:Type:date',
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Document.dateOfExpiry-v1',
    version: '1',
    type: 'cvc:Type:date',
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Document.dateOfBirth-v1',
    version: '1',
    type: 'cvc:Type:date',
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Document.enum-v1',
    version: '1',
    type: 'String',
  },
  {
    identifier: 'claim-cvc:Document.type-v1',
    version: '1',
    type: 'cvc:Type:documentType',
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Document.gender-v1',
    version: '1',
    type: 'String',
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Document.issueLocation-v1',
    version: '1',
    type: 'String',
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Document.issueAuthority-v1',
    version: '1',
    type: 'String',
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Document.issueCountry-v1',
    version: '1',
    type: 'cvc:Type:country',
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Document.placeOfBirth-v1',
    version: '1',
    type: 'String',
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Type.email-v1',
    version: '1',
    type: {
      properties: [
        {
          name: 'username',
          type: 'cvc:Email:username',
        },
        {
          name: 'domain',
          type: 'claim-cvc:Email.domain-v1',
        },
      ],
    },
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Type.phoneNumber-v1',
    version: '1',
    type: {
      properties: [
        {
          name: 'country',
          type: 'claim-cvc:PhoneNumber.country-v1',
        },
        {
          name: 'countryCode',
          type: 'claim-cvc:PhoneNumber.countryCode-v1',
        },
        {
          name: 'number',
          type: 'claim-cvc:PhoneNumber.number-v1',
        },
        {
          name: 'extension',
          type: 'claim-cvc:PhoneNumber.extension-v1',
        },
        {
          name: 'lineType',
          type: 'claim-cvc:PhoneNumber.lineType-v1',
        },
      ],
      required: ['country', 'countryCode', 'number', 'lineType'],
    },
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:PhoneNumber.country-v1',
    type: 'cvc:Type:country',
    version: '1',
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Type.Name-v1',
    version: '1',
    type: {
      properties: [
        {
          name: 'givenNames',
          type: 'claim-cvc:Name.givenNames-v1',
        },
        {
          name: 'familyNames',
          type: 'claim-cvc:Name.familyNames-v1',
        },
        {
          name: 'otherNames',
          type: 'claim-cvc:Name.otherNames-v1',
        },
      ],
      required: ['givenNames'],
    },
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Type.address-v1',
    version: '1',
    type: {
      properties: [
        {
          name: 'country',
          type: 'claim-cvc:Address.country-v1',
        },
        {
          name: 'county',
          type: 'claim-cvc:Address.county-v1',
        },
        {
          name: 'state',
          type: 'claim-cvc:Address.state-v1',
        },
        {
          name: 'street',
          type: 'claim-cvc:Address.street-v1',
        },
        {
          name: 'unit',
          type: 'claim-cvc:Address.unit-v1',
        },
        {
          name: 'city',
          type: 'claim-cvc:Address.city-v1',
        },
        {
          name: 'postalCode',
          type: 'claim-cvc:Address.postalCode-v1',
        },
      ],
      required: ['street', 'city', 'state', 'country'],
    },
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Address.street-v1',
    version: '1',
    type: 'String',
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Address.unit-v1',
    version: '1',
    type: 'String',
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Document.properties-v1',
    version: '1',
    attestable: true,
    type: {
      properties: [
        {
          name: 'dateOfIssue',
          type: 'claim-cvc:Document.dateOfIssue-v1',
        },
        {
          name: 'dateOfExpiry',
          type: 'claim-cvc:Document.dateOfExpiry-v1',
        },
      ],
      required: ['dateOfIssue'],
    },
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:SocialSecurity.number-v1',
    version: '1',
    type: 'cvc:Type:socialSecurityNumber',
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Validation:evidences.idDocumentFront-v1',
    version: '1',
    type: 'cvc:Evidences:idDocumentFront',
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Validation:evidences.idDocumentBack-v1',
    version: '1',
    type: 'cvc:Evidences:idDocumentBack',
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Validation:evidences.selfie-v1',
    version: '1',
    type: 'cvc:Evidences:selfie',
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Document.evidences-v1',
    version: '1',
    attestable: true,
    type: {
      properties: [{
        name: 'idDocumentFront',
        type: 'claim-cvc:Validation:evidences.idDocumentFront-v1',
      },
      {
        name: 'idDocumentBack',
        type: 'claim-cvc:Validation:evidences.idDocumentBack-v1',
      },
      {
        name: 'selfie',
        type: 'claim-cvc:Validation:evidences.selfie-v1',
      }],
    },
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Medical.vaccinationDateOfAdministration-v1',
    version: '1',
    type: 'cvc:Type:date',
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Medical.vaccinationName-v1',
    version: '1',
    type: 'String',
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Medical.vaccinationRecordDetail-v1',
    version: '1',
    type: {
      properties: [
        {
          name: 'createdAt',
          type: 'cvc:Type:date',
        },
        {
          name: 'updatedAt',
          type: 'cvc:Type:date',
        },
      ],
    },
    required: ['createdAt'],
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Medical.organisation-v1',
    version: '1',
    type: {
      properties: [
        {
          name: 'name',
          type: 'String',
        },
      ],
    },
    required: ['name'],
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Medical.patient-v1',
    version: '1',
    type: {
      properties: [
        {
          name: 'name',
          type: 'claim-cvc:Type.Name-v1',
        },
        {
          name: 'dateOfBirth',
          type: 'claim-cvc:Identity.dateOfBirth-v1',
        },
      ],
    },
    required: ['name'],
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Medical.code-v1',
    version: '1',
    type: {
      properties: [
        {
          name: 'name',
          type: 'String',
        },
        {
          name: 'code',
          type: 'String',
        },
        {
          name: 'codeSystem',
          type: 'String',
        },
        {
          name: 'codeSystemName',
          type: 'String',
        },
      ],
    },
    required: ['name', 'code'],
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Medical.vaccinationManufacturer-v1',
    version: '1',
    type: {
      properties: [
        {
          name: 'name',
          type: 'String',
        },
        {
          name: 'code',
          type: 'claim-cvc:Medical.code-v1',
        },
      ],
      required: ['name'],
    },
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Medical.vaccinationRecord-v1',
    version: '1',
    type: {
      properties: [
        {
          name: 'dateOfAdministration',
          type: 'claim-cvc:Medical.vaccinationDateOfAdministration-v1',
        },
        {
          name: 'manufacturer',
          type: 'claim-cvc:Medical.vaccinationManufacturer-v1',
        },
        {
          name: 'name',
          type: 'claim-cvc:Medical.vaccinationName-v1',
        },
        {
          name: 'detail',
          type: 'claim-cvc:Medical.vaccinationRecordDetail-v1',
        },
        {
          name: 'organisation',
          type: 'claim-cvc:Medical.organization-v1',
        },
        {
          name: 'codes',
          type: 'Array',
          items: {
            type: 'claim-cvc:Medical.code-v1',
          },
        },
      ],
      required: ['dateOfAdministration', 'name', 'organisation'],
    },
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Medical.vaccination-v1',
    version: '1',
    type: {
      properties: [
        {
          name: 'records',
          type: 'Array',
          items: {
            type: 'claim-cvc:Medical.vaccinationRecord-v1',
          },
        },
        {
          name: 'name',
          type: 'claim-cvc:Medical.vaccinationName-v1',
        },
        {
          name: 'patient',
          type: 'claim-cvc:Medical.patient-v1',
        },
      ],
    },
    required: ['records', 'name', 'patient'],
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Medical.testDate-v1',
    version: '1',
    type: 'cvc:Type:date',
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Medical.testType-v1',
    version: '1',
    type: 'String',
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Medical.testResult-v1',
    version: '1',
    type: 'String',
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Medical.testRecord-v1',
    version: '1',
    type: {
      properties: [
        {
          name: 'date',
          type: 'claim-cvc:Medical.testDate-v1',
        },
        {
          name: 'type',
          type: 'claim-cvc:Medical.testType-v1',
        },
        {
          name: 'result',
          type: 'claim-cvc:Medical.testResult-v1',
        },
        {
          name: 'codes',
          type: 'Array',
          items: {
            type: 'claim-cvc:Medical.code-v1',
          },
        },
      ],
      required: ['date', 'type', 'result'],
    },
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Medical.test-v1',
    version: '1',
    type: {
      properties: [
        {
          name: 'records',
          type: 'Array',
          items: {
            type: 'claim-cvc:Medical.testRecord-v1',
          },
        },
        {
          name: 'name',
          type: 'claim-cvc:Medical.testName-v1',
        },
        {
          name: 'patient',
          type: 'claim-cvc:Medical.patient-v1',
        },
      ],
    },
    required: ['records', 'name', 'patient'],
    credentialItem: true,
  },
  {
    identifier: 'claim-cvc:Medical.covid19-v1',
    version: '1',
    type: {
      properties: [
        {
          name: 'vaccination',
          type: 'claim-cvc:Medical.vaccination-v1',
        },
        {
          name: 'test',
          type: 'claim-cvc:Medical.test-v1',
        },
      ],
    },
    credentialItem: true,
  },
];

function transformUcaIdToClaimId(identifier) {
  const identifierComponents = identifier.split(':');
  return `claim-cvc:${identifierComponents[1]}.${identifierComponents[2]}-v1`;
}

function isDefinitionEqual(definition, ucaDefinition) {
  return definition.identifier === transformUcaIdToClaimId(ucaDefinition.identifier)
    || definition.identifier === ucaDefinition.identifier;
}

ucaDefinitions.forEach((ucaDefinition) => {
  let found = false;
  definitions.some((definition) => {
    if (isDefinitionEqual(definition, ucaDefinition)) {
      found = true;
    }
    return found;
  });
  if (!found) {
    definitions.push(ucaDefinition);
  }
});

module.exports = definitions;
