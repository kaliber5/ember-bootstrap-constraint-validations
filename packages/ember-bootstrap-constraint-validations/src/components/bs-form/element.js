import BaseBsFormElement from 'ember-bootstrap/components/bs-form/element';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class BsFormElement extends BaseBsFormElement {
  '__ember-bootstrap_subclass' = true;

  get controlElement() {
    return document.getElementById(this.formElementId);
  }

  @tracked
  errors = [];

  get hasValidator() {
    return true;
  }

  @action
  showValidationOnHandler(...args) {
    this._updateErrors();
    super.showValidationOnHandler(...args);
  }

  _updateErrors() {
    let { controlElement } = this;
    this.errors = controlElement.validity.valid
      ? []
      : [controlElement.validationMessage];
  }
}
