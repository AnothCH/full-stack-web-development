//include express module or package
const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const { questionnaire } = require("./db");

//create instance of express
const app = express();

// set the view engine to ejs
app.set("view engine", "ejs");
app.use(bodyParser.json());

// index page
app.get("/", async function (req, res) {
  const questions = await questionnaire.findMany();
  res.render("index", {
    data: questions,
  });
});

app.get("/qa", function (req, res) {
  res.render("addQuestion");
});

app.get("/qa/:id", async function (req, res) {
  const { id } = req.params;
  let question = await questionnaire.findFirst({
    where: { id: parseInt(id) },
    select: {
      id: true,
      question: true,
      ans1: true,
      ans2: true,
      ans3: true,
      ans4: true,
      ans5: true,
      ans6: true,
    },
  });
  let options = [
    question.ans1,
    question.ans2,
    question.ans3,
    question.ans4,
    question.ans5,
    question.ans6,
  ];
  res.render("showQuestion", { data: question, options });
});

app.post("/result", async function (req, res) {
  const { id, selected_answer } = req.body;
  const question = await questionnaire.findFirst({
    where: { id: parseInt(id) },
  });

  let correct_answer = question.correct;
  let incorrect_answer = question.incorrect;
  let correct_bool = false;

  if (
    question.correct_answer.replace(/\s/g, "") !==
    selected_answer.replace(/\s/g, "")
  ) {
    incorrect_answer += 1;
  } else {
    correct_answer += 1;
    correct_bool = true;
  }

  await questionnaire.update({
    where: { id: parseInt(id) },
    data: {
      correct: correct_answer,
      incorrect: incorrect_answer,
    },
  });

  return res.json({
    success: true,
    correct: correct_bool,
    message: "Result has been submitted",
  });
});

app.get("/qa/:id/result", async function (req, res) {
  const { id } = req.params;
  const question = await questionnaire.findFirst({
    where: { id: parseInt(id) },
    select: {
      question: true,
      correct_answer: true,
      correct: true,
      incorrect: true,
    },
  });
  res.render("result", { data: question });
});

app.post("/qa", async (req, res) => {
  const {
    question,
    correct_answer,
    option_0,
    option_1,
    option_2,
    option_3,
    option_4,
    option_5,
  } = req.body;

  await questionnaire.create({
    data: {
      question,
      ans1: option_0 !== undefined ? option_0 : null,
      ans2: option_1 !== undefined ? option_1 : null,
      ans3: option_2 !== undefined ? option_2 : null,
      ans4: option_3 !== undefined ? option_3 : null,
      ans5: option_4 !== undefined ? option_4 : null,
      ans6: option_5 !== undefined ? option_5 : null,
      correct_answer: correct_answer,
    },
  });

  return res.json({
    success: true,
    message: "Question has created",
  });
});

app.get("/qa/:id/delete", async (req, res) => {
  const { id } = req.params;
  await questionnaire.delete({
    where: { id: parseInt(id) },
  });
  return res.redirect("/");
});

app.listen(4000, () => console.log("Listening on port 4000!"));
