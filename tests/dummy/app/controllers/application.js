import Controller from '@ember/controller';
import { action } from '@ember/object';

class Model {
  name = null;
  email = null;
}

export default class ApplicationController extends Controller {
  model = new Model();

  @action
  submit() {
    window.alert('Submitted!');
  }

  @action
  invalid() {
    window.alert('Invalid!');
  }
}
