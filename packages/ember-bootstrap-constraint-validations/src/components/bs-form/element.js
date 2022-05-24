import BaseBsFormElement from 'ember-bootstrap/components/bs-form/element';

export default class BsFormElement extends BaseBsFormElement {
  '__ember-bootstrap_subclass' = true;

  get errors() {
    // let { model, property } = this.args;

    return ['dummy error'];
  }

  get hasValidator() {
    return true;
  }
}
