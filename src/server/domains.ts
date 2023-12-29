import {
  ALLOWED_METHODS,
  BASE_ROUTE,
  HTTP_STATUS,
} from './config';

function constructResponse(response, body) {
  response.end(JSON.stringify(body));
}

function validateRequest(request, response) {
  if (!ALLOWED_METHODS.includes(request.method)) {
    response.statusCode = HTTP_STATUS.METHOD_NOT_ALLOWED;
    return constructResponse(response, errorMessage(`Method aren't allowed`));
  }
  if (!request.url.startsWith(BASE_ROUTE)) {
    response.statusCode = HTTP_STATUS.NOT_FOUND;
    return constructResponse(
      response,
      errorMessage(`Not found: ${request.url}`)
    );
  }
}

function errorMessage(error: string) {
  return {
    statusText: -1,
    error,
  };
}


function getRandomList(message: string, numOfTeams: number) {
  const nomesRegex = /\d+\.\s*([^\d\s.]+\S+)/g;
  const nomesEncontrados = message.match(nomesRegex) as string [];

  const nomes = nomesEncontrados.map((nome) => {
    const nomeRegex = /\d+\.\s*([^\d\s.]+\S+)/;
    const [, match] = nome.match(nomeRegex) as string[];
    return match;
  });

  const nomesValidos = nomes.filter((nome) => nome !== '');

  const nomesEmbaralhados = shuffleArray(nomesValidos);

  // const grupos = splitInTeams(nomesEmbaralhados, numeroGrupos);
  const grupos = splitInTeams(
    nomesEmbaralhados,
    Math.ceil(nomesEmbaralhados.length / numOfTeams)
  );

  return grupos;
}

function shuffleArray(array) {
  const newArray = array.slice();
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function splitInTeams(array, largura) {
  const grupos = [];
  const numGrupos = Math.ceil(array.length / largura);
  for (let i = 0; i < numGrupos; i++) {
    grupos.push(array.slice(i * largura, (i + 1) * largura));
  }
  return grupos;
}

function constructMessage(team, index) {
  return `Time *${index + 1}*:\n\n ${team.join(', ')}`;
}

function sortTeams(message, numberOfTeams) {
  const teamsMessage = getRandomList(message, numberOfTeams).map(
    constructMessage
  );

  return teamsMessage.join('\n\n');
}
function encontrarNumeroSorteio(string) {
  const regex = /Sorteia (\d+) times/;
  const match = string.match(regex);
  if (match) {
    return parseInt(match[1]);
  }
}
function catchMsg(msg) {
  const numberOfTeams = encontrarNumeroSorteio(msg.body);
  if (numberOfTeams) {
    const message = sortTeams(msg.body, numberOfTeams);
    if (!msg.reply) {
      return message;
    }
    console.log(message);
    msg.reply(message);
  }
}

module.exports = {
  errorMessage,
  constructResponse,
  validateRequest,
  HTTP_STATUS,
  sortTeams,
  catchMsg,
};

