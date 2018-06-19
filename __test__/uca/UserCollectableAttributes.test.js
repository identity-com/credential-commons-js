const UCA = require('../../src/uca/UserCollectableAttribute');

describe('UCA Constructions tests', () => {
  test('UCA construction should fails', () => {
    function createUCA() {
      return new UCA('name.first', 'joao');
    }

    expect(createUCA).toThrowError('name.first is not defined');
  });

  test('UCA construction should succeed', () => {
    const v = new UCA('civ:Identity:name.first', 'joao');
    expect(v).toBeDefined();
  });

  test('UCA return the correct global Credential Identifier', () => {
    const v = new UCA('civ:Identity:name.first', 'joao', '1');
    expect(v.getGlobalCredentialItemIdentifier()).toBe('uca-civ:Identity:name.first-1');
  });

  test('UCA should have identifier', () => {
    const identifier = 'civ:Identity:name.first';
    const v = new UCA(identifier, 'joao');
    expect(v).toBeDefined();
    expect(v.identifier).toEqual(identifier);
    expect(v.version).toBeDefined();
  });

  test('UCA dont construct incomplete objects', () => {
    const identifier = 'civ:Identity:name';
    const value = {
      last: 'santos',
    };
    function createUCA() {
      return new UCA(identifier, value);
    }

    expect(createUCA).toThrowError('Missing required fields to civ:Identity:name');
  });

  test('UCA dont construct invalid day', () => {
    const identifier = 'civ:Identity:DateOfBirth';
    const value = {
      day: 40,
      month: 13,
      year: 1978,
    };
    function createUCA() {
      return new UCA(identifier, value);
    }

    expect(createUCA).toThrow();
  });

  test('UCA dont construct invalid month', () => {
    const identifier = 'civ:Identity:DateOfBirth';
    const value = {
      day: 20,
      month: 13,
      year: 1978,
    };
    function createUCA() {
      return new UCA(identifier, value);
    }

    expect(createUCA).toThrow();
  });

  test('UCA dont construct invalid year', () => {
    const identifier = 'civ:Identity:DateOfBirth';
    const value = {
      day: 20,
      month: 3,
      year: -1,
    };
    function createUCA() {
      return new UCA(identifier, value);
    }

    expect(createUCA).toThrow();
  });


  test('UCA has type String', () => {
    const identifier = 'civ:Verify:phoneNumber.Token';
    const value = '12345';
    const v = new UCA(identifier, value);
    expect(v).toBeDefined();
    expect(v.type).toEqual('String');
  });

  test('UCA has type Object:civ:Identity:name', () => {
    const identifier = 'civ:Identity:name';
    const value = {
      first: 'joao',
    };
    const v = new UCA(identifier, value);
    expect(v).toBeDefined();
    expect(v.type).toEqual('Object');
  });

  test('UCA has correct object value', () => {
    const identifier = 'civ:Identity:name';
    const value = {
      first: 'Joao',
      middle: 'Paulo',
      last: 'Santos',
    };
    const v = new UCA(identifier, value);

    expect(v).toBeDefined();
    expect(v.value).toHaveProperty('first');
    expect(v.value.first.value).toEqual('Joao');
    expect(v.value).toHaveProperty('middle');
    expect(v.value.middle.value).toEqual('Paulo');
    expect(v.value).toHaveProperty('last');
    expect(v.value.last.value).toEqual('Santos');
  });

  test('UCA has correct complex object value', () => {
    const identifier = 'civ:Identity:DateOfBirth';
    const value = {
      day: 20,
      month: 3,
      year: 1978,
    };
    const v = new UCA(identifier, value);
    expect(v).toBeDefined();
  });


  test('Construct IdentityNameFirst', () => {
    const v = new UCA.IdentityNameFirst('Joao');
    expect(v).toBeDefined();
  });

  test('Construct IdentityNameFirst', () => {
    const v = new UCA.IdentityName({ first: 'Joao', middle: 'Barbosa', last: 'Santos' });
    expect(v).toBeDefined();
  });

  test('UCA return simple Attestatble Value', () => {
    const v = new UCA.IdentityNameFirst('Joao');
    expect(v).toBeDefined();
    const attValues = v.getAttestableValues();
    // console.log(attValues);
    expect(attValues).toHaveLength(1);
    expect(attValues[0].identifier).toBe('civ:Identity:name.first');
    expect(attValues[0].value).toContain('s:');
    expect(attValues[0].value).toContain(':Joao');
  });

  test('UCA should Construct with a simple Attestatble Value', () => {
    const aSingleAttestationValue = 's:873b59b3c4faa0c63e6ec788041291f36b915357cffaaf6c39661b2a94783d19:Joao';
    const v = new UCA.IdentityNameFirst({ attestableValue: aSingleAttestationValue });
    expect(v).toBeDefined();
    // console.log(v);
    const attValues = v.getAttestableValues();
    // console.log(attValues);
    expect(attValues).toHaveLength(1);
    expect(attValues[0].identifier).toBe('civ:Identity:name.first');
    expect(attValues[0].value).toContain('s:');
    expect(attValues[0].value).toContain(':Joao');
  });

  test('UCA return complex/multiple Attestatble Values', () => {
    const v = new UCA.IdentityName({ first: 'Joao', middle: 'Barbosa', last: 'Santos' });
    expect(v).toBeDefined();
    const attValues = v.getAttestableValues();
    // console.log(attValues);
    expect(attValues).toHaveLength(4);
    expect(attValues[0].identifier).toBe('civ:Identity:name');
    expect(attValues[0].value).toContain('s:');
    expect(attValues[0].value).toContain(':Joao');
    expect(attValues[0].value).toContain(':Barbosa');
    expect(attValues[0].value).toContain(':Santos');
  });

  test('UCA should Construct with a complex Attestatble Value: civ:Identity:name', () => {
    // eslint-disable-next-line max-len
    const aComplexAttestableValue = 's:0b5cbce9f91d64fc413bdc892017324a0cc1e4614e874056ed16cd8e08ac02de:Joao|s:2211b059eaece64918755075026cebd230e5c18ef883f5e68a196815804d2de3:Santos|s:1eab775b23947b2685ba1ecf5ec9333e3210b3aaaee40ce6dc1fc95ef2d6177e:Barbosa|';

    const v = new UCA.IdentityName({ attestableValue: aComplexAttestableValue });
    expect(v).toBeDefined();
    // console.log(v);
    const attValues = v.getAttestableValues();
    // console.log(attValues);
    expect(attValues).toHaveLength(4);
    expect(attValues[0].identifier).toBe('civ:Identity:name');
    expect(attValues[0].value).toContain('s:');
    expect(attValues[0].value).toContain(':Joao');
    expect(attValues[0].value).toContain(':Barbosa');
    expect(attValues[0].value).toContain(':Santos');
  });

  test('UCA should Construct with a complex Attestatble Value: IdentityName sintaxe suggar', () => {
    // eslint-disable-next-line max-len
    const aComplexAttestableValue = 's:0b5cbce9f91d64fc413bdc892017324a0cc1e4614e874056ed16cd8e08ac02de:Joao|s:2211b059eaece64918755075026cebd230e5c18ef883f5e68a196815804d2de3:Santos|s:1eab775b23947b2685ba1ecf5ec9333e3210b3aaaee40ce6dc1fc95ef2d6177e:Barbosa|';
    const identifier = 'civ:Identity:name';

    const v = new UCA(identifier, { attestableValue: aComplexAttestableValue });
    expect(v).toBeDefined();
    // console.log(v);
    const attValues = v.getAttestableValues();
    // console.log(attValues);
    expect(attValues).toHaveLength(4);
    expect(attValues[0].identifier).toBe(identifier);
    expect(attValues[0].value).toContain('s:');
    expect(attValues[0].value).toContain('0b5cbce9f91d64fc413bdc892017324a0cc1e4614e874056ed16cd8e08ac02de');
    expect(attValues[0].value).toContain(':Joao');
    expect(attValues[0].value).toContain(':Barbosa');
    expect(attValues[0].value).toContain(':Santos');
  });

  test('UCA should Construct with a complex Attestatble Value: civ:Identity:DateOfBirth', () => {
    const identifier = 'civ:Identity:DateOfBirth';
    // eslint-disable-next-line max-len
    const aComplexAttestableValue = 'n:bdc52df4b0149beb3d67720e82bfd20e86d31e951bd66daeed8a87f3a998de49:00000020|n:0ff6a4dc3b4e7a0b2cfb3a9f0479dc89d9757736d7e46e31ddb3dc53a9179b56:00000003|n:ec4fcd9bad1839c052d0a23a9fba92eaf35d457e83ae50ea902bf3b5c3b490ad:00001978|';

    const v = new UCA(identifier, { attestableValue: aComplexAttestableValue });
    // console.log(v);
    const attestableValue = v.getAttestableValue();
    // console.log(attestableValue);
    expect(attestableValue).toBe(aComplexAttestableValue);
    const attValues = v.getAttestableValues();
    // console.log(attValues);
    expect(attValues).toHaveLength(1);
    expect(attValues[0].identifier).toBe(identifier);
    expect(attValues[0].value).toContain('n:');
    expect(attValues[0].value).toContain(':bdc52df4b0149beb3d67720e82bfd20e86d31e951bd66daeed8a87f3a998de49');
    expect(attValues[0].value).toContain(':00000020');
    expect(attValues[0].value).toContain(':00000003');
    expect(attValues[0].value).toContain(':00001978');
  });

  test('Construct a civ:Meta:expiry', () => {
    const identifier = 'civ:Meta:expiry';
    const isoDate = '2018-06-20T13:51:18.640Z';
    const v = new UCA(identifier, isoDate);
    expect(v).toBeDefined();
    // console.log(v);
    const attValues = v.getAttestableValues();
    // console.log(attValues);
    expect(attValues).toHaveLength(1);
    expect(attValues[0].identifier).toBe(identifier);
    expect(attValues[0].value).toContain('s:');
    expect(attValues[0].value).toContain(`:${isoDate}`);
  });

  test('Construct a civ:Meta:expiry as a Attestatble Value', () => {
    const identifier = 'civ:Meta:expiry';
    const anAttestationValue = 's:9dabdd37eca1bc98bcc725d66c77f10707fa9f3292752a31ad9dd94d17557e81:2018-06-20T13:51:18.640Z';
    const v = new UCA(identifier, { attestableValue: anAttestationValue });
    expect(v).toBeDefined();
    // console.log(v);
    const attValues = v.getAttestableValues();
    // console.log(attValues);
    expect(attValues).toHaveLength(1);
    expect(attValues[0].identifier).toBe(identifier);
    expect(attValues[0].value).toContain('s:');
    expect(attValues[0].value).toContain(':2018-06-20T13:51:18.640Z');
  });
});
