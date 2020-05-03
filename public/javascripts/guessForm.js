$(document).ready(function () {
  /**
   * Handle Guess Click
   */
  async function guessInputHandler() {
    const guess = $('#guess').val();
    if (typeof guess === 'undefined' || guess <= -1 || guess === '') return;
    console.log(`user guess: ${guess}`);
    try {
      const response = await fetch('/guess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guess,
        }),
      });
      const result = await response.json();
      const li = $('<li/>');
      if (result.result === 'success') {
        console.log('guess was sucess');
        window.location.replace(
          `${window.location.protocol}//${window.location.host}/success`
        );
      } else if (result.result === 'too high') {
        li.addClass('highGuess p-3 font-weight-bolder rounded-pill')
          .text(`${guess} is too high`)
          .appendTo('#guess-display');
      } else if (result.result === 'too low') {
        li.addClass('lowGuess p-3 font-weight-bolder rounded-pill')
          .text(`${guess} is too low`)
          .appendTo('#guess-display');
      }
      $('#guess').val('');
      const ul = $('#guess-display');
      ul[0].scrollTop = ul[0].scrollHeight;
    } catch (error) {
      console.log(error);
    }
  }
  /*
    === Main Logic ===
  */
  $('form').on('keypress', function (e) {
    if (e.which === 13) {
      e.preventDefault();
      $('#guess_input').click();
      return false;
    }
    return true;
  });
  $('#guess_input').on('click', guessInputHandler);
});
