const evaluate = document.getElementById("evaluate");

let score = 0;

evaluate.onclick = () => {
  evaluatePackaging();
};

function increaseScore() {
  score++;
}

function evaluateQuestion(question) {
  question = question.toLowerCase().replace(/\s+/g, "");
  if (question === "y") {
    increaseScore();
  }
}

function giveAdvice() {
  let advice = "";
  if (score <= 5) {
    advice =
      "Your video packaging needs significant improvement. Focus on creating a concise, clear title and an eye-catching thumbnail. Consider the following tips:\n\n" +
      "1. Shorten your title to under 50 characters\n" +
      "2. Make your thumbnail bright and clear\n" +
      "3. Ensure your packaging is easily understood at a glance\n" +
      "4. Tailor your content to your target audience\n" +
      "5. Use contrast and scale in your thumbnail design";
  } else if (score <= 10) {
    advice =
      "You're on the right track, but there's room for improvement. Consider these suggestions:\n\n" +
      "1. Refine your title to complement the thumbnail without redundancy\n" +
      "2. Focus more on human interest in your packaging\n" +
      "3. Use references to build a stronger packaging concept\n" +
      "4. Improve the clarity of your thumbnail's message\n" +
      "5. Apply color theory principles to make your thumbnail more appealing";
  } else if (score <= 14) {
    advice =
      "Great job! Your video packaging is very good. To make it even better, consider these final touches:\n\n" +
      "1. Fine-tune your thumbnail to have exactly 3 focus areas\n" +
      "2. Ensure your packaging is compelling even to a sleepy viewer\n" +
      "3. Double-check that your thumbnail text is 5 words or fewer\n" +
      "4. Review your use of color theory in the thumbnail\n" +
      "5. Make sure every element in your packaging serves a purpose";
  } else if (score === 15) {
    advice =
      "Perfect execution! Your video packaging is excellent. Keep up the great work and continue to apply these principles in your future content.";
  }

  alert(advice);
}

function evaluatePackaging() {
  let q1 = prompt(
    "Can your title convey its message in under 50 characters? [y/n]"
  );
  evaluateQuestion(q1);
  let q2 = prompt(
    "Would viewers across different geographical regions understand your title? [y/n]"
  );
  evaluateQuestion(q2);
  let q3 = prompt(
    "Does your title complement the thumbnail without redundancy? [y/n]"
  );
  evaluateQuestion(q3);
  let q4 = prompt("Have you focused on human interest? [y/n]");
  evaluateQuestion(q4);
  let q5 = prompt("Is your title easily readable at a glance? [y/n]");
  evaluateQuestion(q5);
  let q6 = prompt(
    "Did you use a reference to build your packaging concept? [y/n]"
  );
  evaluateQuestion(q6);
  let q7 = prompt(
    "Is your packaging tailored specifically to your target audience? [y/n]"
  );
  evaluateQuestion(q7);
  let q8 = prompt(
    "Would your thumbnail and title compel a sleepy viewer to click? [y/n]"
  );
  evaluateQuestion(q8);
  let q9 = prompt(
    "Can viewers understand your video's content from a glance at the packaging? [y/n]"
  );
  evaluateQuestion(q9);
  let q10 = prompt(
    "Does your packaging utilize contrast, scale, or comparison effectively? [y/n]"
  );
  evaluateQuestion(q10);
  let q11 = prompt(
    "Are unnecessary elements removed from your thumbnail? [y/n]"
  );
  evaluateQuestion(q11);
  let q12 = prompt(
    "Is your thumbnail bright and clear enough to stand out? [y/n]"
  );
  evaluateQuestion(q12);
  let q13 = prompt(
    "Does your thumbnail text consist of 5 words or fewer? [y/n]"
  );
  evaluateQuestion(q13);
  let q14 = prompt("Does your thumbnail have 3-focus areas? [y/n]");
  evaluateQuestion(q14);
  let q15 = prompt(
    "Does your thumbnail utilize color theory principles? [y/n]"
  );
  evaluateQuestion(q15);

  alert(`You scored ${score}/15 points.`);

  giveAdvice();

  score = 0;
}
