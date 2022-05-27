const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    describe('валидатор проверяет строковые поля', () => {
      it('является ли строкой, дальнейшая проверка должна прекратится', () => {
        const validator = new Validator({
          name: {
            type: 'string',
          },
        });

        const errors = validator.validate({ name: 1000000 });

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').and.to.be.equal('expect string, got number');
      });
      it('если строка меньше чем требуется', () => {
        const validator = new Validator({
          name: {
            type: 'string',
            min: 10,
            max: 20,
          },
        });

        const errors = validator.validate({ name: 'Lalala' });

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');
      });
      it('если строка больше чем требуется', () => {
        const validator = new Validator({
          name: {
            type: 'string',
            min: 10,
            max: 20,
          },
        });

        const errors = validator.validate({ name: 'LalalaLalalaLalalaLalalaLalala' });

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too long, expect 20, got 30');
      });
    })
    describe('валидатор проверяет числовые поля', () => {
      it('является ли числом, дальнейшая проверка должна прекратится', () => {
        const validator = new Validator({
          age: {
            type: 'number',
          },
        });

        const errors = validator.validate(({age: '28'}));

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0]).to.have.property('error').and.to.be.equal('expect number, got string')
      });
      it('если число меньше чем требуется', () => {
        const validator = new Validator({
          age: {
            type: 'number',
            min: 18,
            max: 27,
          },
        });

        const errors = validator.validate(({age: 17}));

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too little, expect 18, got 17')
      });
      it('если больше чем требуется', () => {
        const validator = new Validator({
          age: {
            type: 'number',
            min: 18,
            max: 27,
          },
        });

        const errors = validator.validate(({age: 28}));

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect 27, got 28')
      });
    })
  });
});
