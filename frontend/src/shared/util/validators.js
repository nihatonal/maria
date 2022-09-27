const VALIDATOR_TYPE_REQUIRE = 'REQUIRE';
const VALIDATOR_TYPE_MINLENGTH = 'MINLENGTH';
const VALIDATOR_TYPE_MAXLENGTH = 'MAXLENGTH';
const VALIDATOR_TYPE_MIN = 'MIN';
const VALIDATOR_TYPE_PHONE = 'PHONES';
const VALIDATOR_TYPE_EMAIL = 'EMAIL';
const VALIDATOR_TYPE_FILE = 'FILE';
const VALIDATOR_TYPE_NUMBER = 'NUMBER';
const VALIDATOR_TYPE_CODE = 'CODE';
const VALIDATOR_TYPE_PASSWORD = 'PASSWORD';
const VALIDATOR_TYPE_PASSWORD_CONFIRM = 'PASSWORD_CONFIRM';

export const VALIDATOR_REQUIRE = () => ({ type: VALIDATOR_TYPE_REQUIRE });
export const VALIDATOR_FILE = () => ({ type: VALIDATOR_TYPE_FILE });
export const VALIDATOR_NUMBER = () => ({ type: VALIDATOR_TYPE_NUMBER });
export const VALIDATOR_MINLENGTH = val => ({
  type: VALIDATOR_TYPE_MINLENGTH,
  val: val
});
export const VALIDATOR_MAXLENGTH = val => ({
  type: VALIDATOR_TYPE_MAXLENGTH,
  val: val
});
export const VALIDATOR_MIN = val => ({ type: VALIDATOR_TYPE_MIN, val: val });
export const VALIDATOR_PHONE = val => ({ type: VALIDATOR_TYPE_PHONE, val: val });
export const VALIDATOR_EMAIL = () => ({ type: VALIDATOR_TYPE_EMAIL });
export const VALIDATOR_CODE = () => ({ type: VALIDATOR_TYPE_CODE });
export const VALIDATOR_PASSWORD = () => ({ type: VALIDATOR_TYPE_PASSWORD });
export const VALIDATOR_PASSWORD_CONFIRM = val => ({ type: VALIDATOR_TYPE_PASSWORD_CONFIRM, val: val });

export const validate = (value, validators) => {
  
  let isValid = true;
  for (const validator of validators) {
    if (validator.type === VALIDATOR_TYPE_REQUIRE) {
      isValid = isValid && value.trim().length > 0;
    }
    if (validator.type === VALIDATOR_TYPE_MINLENGTH) {
      isValid = isValid && value.trim().length >= validator.val;
    }
    if (validator.type === VALIDATOR_TYPE_MAXLENGTH) {
      isValid = isValid && value.trim().length <= validator.val;
    }
    if (validator.type === VALIDATOR_TYPE_MIN) {
      isValid = isValid && +value >= validator.val;
    }
    if (validator.type === VALIDATOR_TYPE_PHONE) {
      isValid = isValid && /[0-9]{11}$/.test(value);
    }
    if (validator.type === VALIDATOR_TYPE_CODE) {
      isValid = isValid && /[0-9]{3}-[0-9]{3}$/.test(value);
    }
    if (validator.type === VALIDATOR_TYPE_EMAIL) {
      isValid = isValid && /^\S+@\S+\.\S+$/.test(value);
    }
    if (validator.type === VALIDATOR_TYPE_PASSWORD) {
      isValid = isValid && /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]*$/.test(value);
    }
    if (validator.type === VALIDATOR_TYPE_NUMBER) {
      isValid = isValid && /^[0-9]*$/.test(value);
    }
    if (validator.type === VALIDATOR_TYPE_PASSWORD_CONFIRM) {
      isValid = isValid && value === validator.val;
    }}
  return isValid;
};

// /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]*$/

