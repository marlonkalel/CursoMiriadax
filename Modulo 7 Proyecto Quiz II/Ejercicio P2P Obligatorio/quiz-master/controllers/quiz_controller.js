var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.findById(quizId).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else { next(new Error('No existe quizId=' + quizId)); }
    }
  ).catch(function(error) { next(error);});
};

// GET /quizes (incluida la búsqueda de preguntas)
exports.index = function(req, res) {
  if (req.query.search){
    var titulo = 'Resultados de búsqueda';
    models.Quiz.findAll({where: ["pregunta like ?", '%' + req.query.search + '%']}).then(
      function(quizes) {
        res.render('quizes/index', { quizes: quizes, titulo: titulo});
      }
    ).catch(function(error) { next(error);});
  }
  else {
    var titulo = '';
    models.Quiz.findAll().then(
      function(quizes) {
        res.render('quizes/index', { quizes: quizes, titulo: titulo});
      }
    ).catch(function(error) { next(error);});
  };
};

// GET /quizes/:id
exports.show = function(req, res) {
  res.render('quizes/show', { quiz: req.quiz});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
};

// GET /quizes/new
exports.new = function(req, res) {
  var quiz = models.Quiz.build(
    {pregunta: "Pregunta", respuesta: "Respuesta"}
  );

  res.render('quizes/new', {quiz: quiz});
};

// POST /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build( req.body.quiz );

// guarda en DB los campos pregunta y respuesta de quiz
  quiz.save({fields: ["pregunta", "respuesta"]}).then(function(){
    res.redirect('/quizes');  
  })   // res.redirect: Redirección HTTP a lista de preguntas
};