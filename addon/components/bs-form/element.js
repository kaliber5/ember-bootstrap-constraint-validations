import BaseBsFormElement from 'ember-bootstrap/components/bs-form/element';
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

  get errors() {
    // native validation state doesn't integrate with Ember's autotracking, so we need to invalidate our `errors` getter explicitly when
    // `this.value` changes by consuming it here.
    // eslint-disable-next-line no-unused-vars
    let { controlElement, value } = this;
    return !controlElement || controlElement.validity.valid
      ? []
      : [controlElement.validationMessage];
  }

  get hasValidator() {
    return true;
  }
}
