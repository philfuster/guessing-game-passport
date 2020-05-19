$('document').ready(() => {
  const passwordInput = $('#password');
  /**
   * validatePasswordReqs
   */
  function validatePasswordReqs(event) {
    if (event.which === 13) {
      console.log('default prevented lol');
      event.preventDefault();
    }
    const pwInput = passwordInput.val();

    const lengthReq = /.{8,}/gm;
    const numberRec = /\d{1,}/gm;
    const uppercaseReq = /[A-Z]/gm;
    const specialCharReq = /[-\/=\\#^$*+?.()|[\]{}]/gm;
    const pattern = /\w{8,}\d{1,}[A-Z][-\/=\\#^$*+?.()|[\]{}]/gm;
    console.log(`inputCount=${passwordInput.val()}`);
    if (lengthReq.test(pwInput)) {
      $('span[data-lenMin').text('\u2714');
      console.log('validatePWREQ type ish called boioi');
    } else {
      $('span[data-lenMin').text('\u274C');
    }

    if (numberRec.test(pwInput)) {
      $('span[data-numMin').text('\u2714');
      console.log('validatePWREQ type ish called boioi');
    } else {
      $('span[data-numMin').text('\u274C');
    }

    if (specialCharReq.test(pwInput)) {
      $('span[data-specCharMin').text('\u2714');
      console.log('validatePWREQ type ish called boioi');
    } else {
      $('span[data-specCharMin').text('\u274C');
    }

    if (uppercaseReq.test(pwInput)) {
      $('span[data-upCaseMin').text('\u2714');
      console.log('validatePWREQ type ish called boioi');
    } else {
      $('span[data-upCaseMin').text('\u274C');
    }
  }

  passwordInput.keyup(validatePasswordReqs);

  passwordInput.focus((e) => {
    if (e.which === 13) {
      console.log('default prevented lol');
      e.preventDefault();
    }
    $('#username-help > span').text('\u274C');
  });
});
