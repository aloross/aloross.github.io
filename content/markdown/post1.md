---
slug: "/blog/post1"
date: "2019-05-04"
title: "Gérer les erreurs dans une application NodeJS"
---

## Jamais d'application sans ses erreurs

Des erreurs, on en voit tous les jours dans nos applications. Que celles-ci soient inattendues ou pas, elles font partie de notre quotidien et il est important de les gérer correctement afin d'éviter des incidents plus ou moins facheux.

Dans le cadre d'une application NodeJS, le comportement par défaut lors d'une erreur est tout simplement le crash. Bien évidemment on utilise des outils adaptés (pm2) pour que le service soit proprement redemarré, mais laisser tomber vos utilisateurs en ligne à cause d'une erreur mineure et anticipable n'est généralement pas la meilleure chose à faire.

Dans cet article, nous allons mettre en place des mécanismes afin d'assurer une gestion des erreurs basique et efficace dans nos applications NodeJS. Voici les differentes étapes de leurs mises en place :

- Distinguer les erreurs opérationnelles et les erreurs de programmation
- Catch les erreurs
- Gerer nos erreurs dans un gestionnaire centralisé

Sans perdre plus de temps, on va mettre les mains dans le camboui et commencer à throw nos première exceptions.

## Parlons des erreurs

Avant de pouvoir s'attaquer à la gestion de nos erreurs, il va être nécessaire de réflêchir un peu sur les erreurs que nous allons créer et utiliser. Pour cela, il faut en premier lieu faire la distinction entre deux types d'erreurs principales que nous allons être amener à traiter :

- les erreurs opérationnelles anticipables et qui font partie du fonctionnement nominal de l'application (une valeur invalide dans un formulaire, un timeout sur une API externe connue pour être capricieuse, etc.) qui peuvent être remontée à l'utilisateur

- les erreurs de programmations et autres (l'indétrônable `undefined is not a function`, un problème de type quelconque, etc.) qui ne peuvent pas être anticipées et doivent mener à un redémarrage de notre appli pour éviter des comportements encore plus inattendus (//TODO petit exemple).

Pour résumer, les erreurs opérationnelles font partie de notre programme, les erreurs de programmation sont des bugs. Il va être de notre responsabilité de marquer la différence dans le code. Pour cela nous pouvons ajouter une propriété lorsque nous lançons une erreur opérationnelle, cela nous permettra de réagir de manière adaptée.

Par exemple :

```js
const invalidLastnameError = new Error("Le nom est requis");
invalidLastnameError.isOperational = true;
throw invalidLastnameError;
```

Si vous voulez aller plus loin, il est également possible de créer vos propres erreurs (j'utilise la syntaxe `class` ici car c'est bien plus simple, mais il est également possible d'utiliser les prototypes)

quelques exemples :

```js
class APIError extends Error {
  constructor(name, message, httpCode, isOperational = true) {
    super(message);

    this.name = name;
    this.httpCode = httpCode;
    this.isOperational = isOperational;

    // Cette partie n'est pas indispensable, mais permet d'améliorer la stack trace
    // Une petite explication par ici : https://stackoverflow.com/questions/63598211/how-to-use-error-capturestacktrace-in-node-js
    Error.captureStackTrace(this, this.constructor);
  }
}

// J'utilise ici un exemple naif, dans un cadre de production, il faudrait extraire des constantes
throw new APIError("InvalidInput", "Lastname is required", 400);
```

> À noter : il est important de toujours utiliser ou étendre l'objet NodeJS `Error` natif lorsque l'on lève une exception et d'éviter d'utiliser des `string` ou encore des objets personnalisés. Cela complique la gestion des erreurs et peut amener à la perte d'information comme la stack trace.

Nous avons désormais totues les cartes en mains pour lever des exceptions qui ont du sens. Elles trouveront leur place dans nos services, méthodes utilitaires, etc.
Il va maintenant s'atteler à les catch afin de pouvoir les traiter.

## Attraper les toutes

Pour gérer nos erreurs, il va falloir en premier lieu les "catcher". Pour cela pas de miracle, on va utiliser le bon vieux try/catch.

```js
try {
  const result = function(param)
} catch (err) {
  // Catastrophe !
}
```

En Javascript, l'asynchrone est partout, il va donc falloir gérer toutes nos belles fonctions qui visent le futur. pour cela, trois syntaxes (et leur méthode associée pour la gestion des erreurs) s'offrent à nous : async/await, les promises et les callbacks.

- Dans le premier cas, c'est pas sorcier, on ajoute le mot clef `await` quand il est nécessaire et le tour est joué :

```js
try {
  const result = await asyncFunctionA();
  const result2 = await asyncFunctionB(result);
  const result3 = await asyncFunctionC(result2);
  await asyncFunctionD(result3);
} catch (err) {
  // Catastrophe !
  handleError(err);
}
```

- Pour les promises, il ne faut pas oublier le petit `.catch` :

```js
asyncFunctionA()
  .then(asyncFunctionB)
  .then(asyncFunctionC)
  .then(asyncFunctionD)
  .catch(handleError);
```

- Et finalement pour les callbacks, et bien, évitez les ! Ceux-ci sont très peu lisibles et amène au fameux [callback hell](http://callbackhell.com/). Si vous utilisez une lib qui utilise cette option pour gérer l'asynchrone je vous conseille vivement de transformer ses méthodes en Promises à l'aide de l'helper [promisify](https://nodejs.org/dist/latest-v8.x/docs/api/util.html#util_util_promisify_original) de NodeJS ou de l'une des plétores de lib qui permettent de le faire, par exemple [bluebird](http://bluebirdjs.com/docs/api/promise.promisify.html).

Pour le choix entre la syntaxe async/await ou Promise, celui-ci vous appartient, je vous conseille simplement d'utiliser l'une ou l'autre et d'éviter de les mélanger afin d'harmoniser votre projet et de vous faciliter la vie.

## On est pas parfait

Comme on a pu le voir, il est relativement simple d'attraper une erreur en JS, mais il est également très simple d'en oublier ! Une belle chaîne de Promise sans le catch associé et c'est la catastrophe assurée.

Pour palier à tout oublie, on va utiliser 2 events disponibles dans NodeJS : `unhandledRejection` et `uncaughtException`.

Un petit exemple :

```js
process.on("unhandledRejection", (err) => {
  // Une promise a été rejeteé sans être gérée dans notre code, cet event nous permet de l'attraper.
  // Nous pouvons directement la lancer sous forme d'erreur, elle sera gérée par l'event suivant !
  throw err;
});

process.on("uncaughtException", (err) => {
  // Ici, on reçoit les erreurs qui n'ont jamais été gérées
  handleError(err);
});
```

> Il faut garder en tête que ces events remontent des erreurs qui n'ont pas été correctement gérées en amont, il est donc très utile d'ajouter un log spécifique ou un monitring particulier dans ce cas afin de penser à corriger le problème.

## Parlons des erreurs

Avant toutes choses, il va falloir faire la distinction entre deux types d'erreurs à traiter :

- les erreurs opérationnelles anticipables et qui font partie du fonctionnement nominal de l'application (une valeur invalide dans un formulaire, un timeout sur une API externe connue pour être capricieuse, etc.) qui peuvent être remontée à l'utilisateur

- les erreurs de programmations et autres (l'indétrônable `undefined is not a function`, un problème de type quelconque, etc.) qui ne peuvent pas être anticipées et doivent mener à un redémarrage de notre appli pour éviter des comportements encore plus inattendus (//TODO petit exemple).

Il arrivera que certaines erreur opérationnelles améneront également à un redémarrage du service, par exemple dans le cas

Pour les différencier, on peut ajouter une propriété lorsque l'on lance l'erreur, cela nous permettra de réagir de manière adaptée :

```js
const invalidLastnameError = new Error("Le nom est requis");
invalidLastnameError.isOperational = true;
throw invalidLastnameError;
```

Si vous voulez aller plus loin, il est également possible de créer vos propres erreurs (j'utilise la syntaxe `class` ici car c'est bien plus simple, mais il est également possible d'utiliser les prototypes)

quelques exemples :

```js
class InvalidInputError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.httpCode = 400;
    this.isOperational = true;
  }
}

class ResourceNotFound extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.httpCode = 404;
    this.isOperational = true;
  }
}

throw new InvalidInputError("Lastname is required");
```

## Et maintenant ?

Après avoir attraper toutes nos belles erreurs, il reste une dernière étape, les gérer ! Pour cela je vous conseille de créer une fonction externe qui sera responsable de les traiter.

```js
// Notre gestionnaire d'erreur centralisé qui peut être utilisé dans tout les contextes (API, tâches CRON, etc.)
errorHandler.handleError = async function handleError(err) {
  await logger.error(err)
  await sendToMonitoringTool(err)

  if (!err.isOperational) {
    process.exit(1)
  }
}

// Une petite fonction utilitaire pour faciliter la génération des réponses en cas d'erreur
errorHandler.sendAPIResponse(err, res) {
  res.status(err.httCode || 500).send(err.message)
}
```

En application dans une application Express, ça donne ça :

```js
// Notre service lance une erreur dans le cas ou l'id est incorrect
movieService.get = (id) => {
  const movie = await BD.getMovie(id);

  if (!movie) {
    throw new ResourceNotFound("This movie does not exists");
  }

  return movie;
};

// On attrape ensuite l'erreur au niveau de nos routes pour les envoyer vers le middleware responsable de gérer les erreurs
// Avec la syntaxe async/await
app.get("/movie", function (req, res, next) {
  try {
    const result = movieService.get(req.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// Avec une promise
app.get("/movie", function (req, res, next) {
  movieService
    .get(req.id)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch(next);
});

// Le middleware de gestion d'erreur
app.use(function (err, req, res, next) {
  await errorHandler.handleError(err);
  await errorHandler.handleAPIError(err, res);
});

// Et on oublie pas les fallbacks !
process.on("unhandledRejection", (reason) => {
  throw reason;
});

process.on("uncaughtException", (err) => {
  await errorHandler.handleError(err);
});
```

[La doc d'Express sur le sujet](https://expressjs.com/en/guide/error-handling.html)

> Avec Express 5 (actuellement en alpha), les erreurs asynchrones sont automatiquement passées, il n'est donc plus nécessaire d'apeller manuellement `next(err)`. La syntaxe suivante sera suffisante :

```js
app.get("/movie", function (req, res, next) {
  await movieService.get(req.id);
});
```

Cet exemple est appliqué sur le framework Express, mais l'idée reste la même quelque soit le framwork que vous allez utiliser.
