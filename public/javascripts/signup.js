$('document').ready(() => {
  const passwordInput = $('#password');
  const confirmPassword = $('#confirmPassword');
  const usernameInput = $('#input-username');
  const submitBtn = $('button[type="submit"]');
  let reqsMet = false;
  let pwReqsMet = false;

  const lengthReq = /.{8,}/m;
  const numberRec = /\d{1,}/m;
  const uppercaseReq = /[A-Z]/m;
  const specialCharReq = /[-\/=\\#^$*+?.()|[\]{}]/m;
  /**
   * checks if requirements are met:
   *    - Password meets password reqs
   *    - Password and confirmPassword match
   *    - Username is filled.
   */
  function isReqsMet() {
    const passwordMatchResult = passwordInput.val() === confirmPassword.val();
    const removingSpacesAndCheckingForNull = usernameInput
      .val()
      .split(/\s/)
      .join('');
    if (
      pwReqsMet &&
      passwordMatchResult &&
      usernameInput.val().split(/\s/).join('')
    ) {
      reqsMet = true;
      submitBtn.removeAttr('disabled');
    } else if (reqsMet === true) {
      reqsMet = false;
      submitBtn.attr('disabled', true);
    }
  }

  /**
   * validatePasswordReqs
   */
  function validatePasswordReqs(event) {
    if (event.which === 13) {
      console.log('default prevented lol');
      event.preventDefault();
    }
    const isWordCharacter = event.key.length === 1;
    const isBackspaceOrDelete = event.keyCode === 8 || event.keyCode === 45;
    if (!isWordCharacter && !isBackspaceOrDelete) return;
    const pwInput = passwordInput.val();
    pwReqsMet = true;
    //
    if (lengthReq.test(pwInput)) {
      $('span[data-lenMin]').text('\u2714');
    } else {
      pwReqsMet = false;
      $('span[data-lenMin]').text('\u274C');
    }
    //
    if (numberRec.test(pwInput)) {
      $('span[data-numMin]').text('\u2714');
    } else {
      $('span[data-numMin').text('\u274C');
      pwReqsMet = false;
    }
    //
    if (specialCharReq.test(pwInput)) {
      $('span[data-specCharMin]').text('\u2714');
    } else {
      $('span[data-specCharMin').text('\u274C');
      pwReqsMet = false;
    }
    //
    if (uppercaseReq.test(pwInput)) {
      $('span[data-upCaseMin]').text('\u2714');
    } else {
      $('span[data-upCaseMin]').text('\u274C');
      pwReqsMet = false;
    }
    isReqsMet();
  }

  passwordInput.keyup(validatePasswordReqs);
  confirmPassword.keyup(validatePasswordReqs);

  confirmPassword.focus((e) => {
    if (passwordInput.val() !== confirmPassword.val()) {
      confirmPassword.addClass('errorShadow');
    }
    isReqsMet();
  });

  confirmPassword.focusout((e) => {
    confirmPassword.removeClass('errorShadow');
  });

  confirmPassword.keyup((e) => {
    if (passwordInput.val() === confirmPassword.val()) {
      confirmPassword.removeClass('errorShadow');
    } else {
      confirmPassword.addClass('errorShadow');
    }
    isReqsMet();
  });

  usernameInput.keyup((e) => {
    isReqsMet();
  });
});
