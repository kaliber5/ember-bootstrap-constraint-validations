import BaseBsForm from 'ember-bootstrap/components/bs-form';
import { assert } from '@ember/debug';

export default class BsForm extends BaseBsForm {
  '__ember-bootstrap_subclass' = true;

  get hasValidator() {
    return true;
  }

  async validate(model, form) {
    assert('Expected to receive the form element when validating.', form instanceof HTMLFormElement);

    if (!form.checkValidity()) {
      throw new Error();
    }
  }
}
