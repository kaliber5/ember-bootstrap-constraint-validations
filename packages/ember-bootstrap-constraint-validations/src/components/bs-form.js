import BaseBsForm from 'ember-bootstrap/components/bs-form';

export default class BsForm extends BaseBsForm {
  '__ember-bootstrap_subclass' = true;

  get hasValidator() {
    return true;
  }

  async validate(model) {
    throw new Error();
  }
}
