import BaseBsFormElement from 'ember-bootstrap/components/bs-form/element';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { assert } from '@ember/debug';

export default class BsFormElement extends BaseBsFormElement {
  '__ember-bootstrap_subclass' = true;

  constructor() {
    super(...arguments);

    assert(
      'showMultipleErrors is not supported for native constraint validations',
      this.args.showMultipleErrors !== true
    );
  }

  get controlElement() {
    return document.getElementById(this.formElementId);
  }

  @tracked
  _invalidateErrors = 0;

  get errors() {
    let { controlElement, _invalidateErrors } = this;
    return !controlElement || controlElement.validity.valid
      ? []
      : [controlElement.validationMessage];
  }

  get hasValidator() {
    return true;
  }

  @action
  showValidationOnHandler(event) {
    // native validation state doesn't integrate with Ember's autotracking, so we need to invalidate our `errors` getter explicitly when an
    // event occurs that could change the validation state

    if (event.type !== 'focusout') {
      // ignore focusout event, as this won't be able to change the validation state, but mutating _invalidateErrors can cause "same computation" assertions
      this._invalidateErrors++;
    }

    super.showValidationOnHandler(event);
  }
}
