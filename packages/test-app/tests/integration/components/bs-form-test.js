import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { hbs } from 'ember-cli-htmlbars';
import {
  render,
  triggerEvent,
  click,
  fillIn,
  focus,
  blur,
  findAll,
  pauseTest,
} from '@ember/test-helpers';

module('Integration | Component | bs-form', function (hooks) {
  setupRenderingTest(hooks);

  test('form is submitted if valid', async function (assert) {
    assert.expect(2);

    let model = {
      name: '1234',
    };

    this.set('model', model);
    this.submitAction = function () {
      assert.step('submit action has been called.');
    };
    this.invalidAction = function () {
      assert.ok(false, 'Invalid action must not been called.');
    };

    await render(hbs`
      <BsForm @model={{this.model}} @onSubmit={{this.submitAction}} @onInvalid={{this.invalidAction}} as |form|>
        <form.element @label="Name" @property="name" as |el|>
          <el.control required/>
        </form.element>
      </BsForm>
    `);

    await triggerEvent('form', 'submit');
    assert.verifySteps(['submit action has been called.']);
  });

  test('validation errors are shown on submit', async function (assert) {
    assert.expect(3);

    let model = {
      name: '',
    };

    this.set('model', model);
    this.submitAction = function () {
      assert.ok(false, 'submit action must not been called.');
    };
    this.invalidAction = function () {
      assert.step('Invalid action has been called.');
    };

    await render(hbs`
      <BsForm @model={{this.model}} @onSubmit={{this.submitAction}} @onInvalid={{this.invalidAction}} as |form|>
        <form.element @label="Name" @property="name" as |el|>
          <el.control required/>
        </form.element>
      </BsForm>
    `);

    await triggerEvent('form', 'submit');
    assert.dom('input').hasClass('is-invalid', 'input has error class');
    assert.verifySteps(['Invalid action has been called.']);
  });

  test('validation errors are shown after blur', async function (assert) {
    this.set('model', { name: '' });

    await render(hbs`
      <BsForm @model={{this.model}} as |form|>
        <form.element @label="Name" @property="name" as |el|>
          <el.control required/>
        </form.element>
      </BsForm>
    `);
    assert.dom('input').doesNotHaveClass('is-invalid');

    await focus('input');
    await blur('input');
    assert.dom('input').hasClass('is-invalid');
  });

  test('validation success is shown after blur', async function (assert) {
    this.set('model', { name: 'Clara' });

    await render(hbs`
      <BsForm @model={{this.model}} as |form|>
        <form.element @label="Name" @property="name" as |el|>
          <el.control required/>
        </form.element>
      </BsForm>
    `);
    assert.dom('input').doesNotHaveClass('is-valid');

    await focus('input');
    await blur('input');
    assert.dom('input').hasClass('is-valid');
  });

  test('validation errors are shown after user input', async function (assert) {
    this.set('model', { name: '' });

    await render(hbs`
      <BsForm @model={{this.model}} as |form|>
        <form.element @label="Name" @property="name" as |el|>
          <el.control required pattern="[a-z]+"/>
        </form.element>
      </BsForm>
    `);
    assert.dom('input').doesNotHaveClass('is-invalid');

    await fillIn('input', 'R');
    assert
      .dom('input')
      .doesNotHaveClass(
        'is-invalid',
        'validation is not shown while user is typing'
      );

    await blur('input');
    assert
      .dom('input')
      .hasClass('is-invalid', 'validation error is shown after focus out');
  });

  test('validation success is shown after user input', async function (assert) {
    this.set('model', { name: '' });

    await render(hbs`
      <BsForm @model={{this.model}} as |form|>
        <form.element @label="Name" @property="name" as |el|>
          <el.control required pattern="[a-z]+"/>
        </form.element>
      </BsForm>
    `);
    assert.dom('input').doesNotHaveClass('is-valid');

    await fillIn('input', 'abc');
    assert
      .dom('input')
      .doesNotHaveClass(
        'is-valid',
        'validation is not shown while user is typing'
      );

    await blur('input');
    assert
      .dom('input')
      .hasClass('is-valid', 'validation success is shown after focus out');
  });

  test('validation state is updated while typing', async function (assert) {
    this.set('model', { name: '' });

    await render(hbs`
      <BsForm @model={{this.model}} as |form|>
        <form.element @controlType="email" @label="Name" @property="name" as |el|>
          <el.control required/>
        </form.element>
      </BsForm>
    `);
    assert.dom('input').doesNotHaveClass('is-valid');

    await focus('input');
    await blur('input');

    await fillIn('input', 'abc');

    assert
      .dom('input')
      .hasClass('is-invalid', 'validation error is shown after focus out');

    await fillIn('input', 'abc@example.com');

    assert
      .dom('input')
      .hasClass('is-valid', 'validation success is shown after focus out');
  });

  test('does not throw when control element is not available', async function (assert) {
    assert.expect(0);
    this.set('model', {});

    await render(hbs`
      <BsForm @model={{this.model}} as |form|>
        <form.element @label="First name" @property="firstname" as |el|>
        </form.element>
        <form.element @label="last name" @property="lastname" as |el|>
          <el.control required/>
        </form.element>
      </BsForm>
    `);

    await triggerEvent('form', 'submit');
  });
});
