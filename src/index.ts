import puppeteer, { type ElementHandle, type Browser, type HTTPResponse, type Page } from 'puppeteer';

/* Esta funcion se está preparando para despues poderse eejcutar en firebase
   no dividiremos el código en varias funciónes si no que intentaremo hacerlo todo con una sola
   para garantizar que cada instancia de navegador se ejecuta por separado
*/

enum Accion {
  LOGIN,
  ULTIMOSDIVS,
  ULTIMOSFICHEIROS,
  DECLAMOVEMENTO,
  ALTANACEMENTO
}

enum Error {
  NOERROR,
  URLLOGIN, // ERRO NA URL DO LOGIN
  URLPRINCIPAL, // ERRO NA URL PRINCIPAL
  ERRORELEMNTOSLOGIN, // ERROR CAPTURANDO OS ELMENTOS DO LOGIN
  LOGIN, // ERRO O FACER LONGIN
  ERRORINFOUSUARIO
}

enum URLS {
  LOGIN = 'https://ovgan.xunta.gal/ovgan/pin/login',
  ALTAPORNACEMENTO = 'https://ovgan.xunta.gal/ovgan/gl/index.html#/misAltasNacimiento/solicitud',
  DECLARACIONDEMOVEMENTO = 'https://ovgan.xunta.gal/ovgan/gl/index.html#/misDeclaracionMovimientosEntradas/solicitud',
  ULTIMOSDIVS = 'https://ovgan.xunta.gal/ovgan/gl/index.html#/dibs'
}

async function ovgan (user: string = '', password: string = '', act: Accion = Accion.LOGIN): Promise<[Error, string]> {
  const navegador: Browser = await puppeteer.launch({ headless: false });
  const pagina: Page = await navegador.newPage();
  const response: HTTPResponse | null = await pagina.goto(URLS.LOGIN);

  if (response == null || response.status() !== 200) {
    return [Error.URLLOGIN, 'Error entrando en login'];
  }

  // Capturamos botones de login y enviamos peticion
  const username: ElementHandle<Element> | null = await pagina.$('[name="username"]');
  const pass: ElementHandle<Element> | null = await pagina.$('[name="password"]');
  const btnEnviar: ElementHandle<Element> | null = await pagina.$('#botonentrarlogin');

  if (username == null || pass == null || btnEnviar == null) {
    await navegador.close();
    return [Error.ERRORELEMNTOSLOGIN, 'Error capturando elementos do login'];
  }

  await username.click();
  await username.type(user);
  await new Promise(resolve => setTimeout(resolve, 3000));
  await pass.click();
  await pass.type(password);
  await new Promise(resolve => setTimeout(resolve, 3000));
  await btnEnviar.focus();
  await btnEnviar.click();
  await new Promise(resolve => setTimeout(resolve, 10000));

  const usuarioElement: ElementHandle<Element> | null = await pagina.$('#header-user-name span');

  if (usuarioElement === null) {
    await navegador.close();
    return [Error.ERRORINFOUSUARIO, 'Error capturando informacion usuario'];
  }

  const txtusuarioElement: string | null | undefined = await usuarioElement?.evaluate(element => element.textContent);

  if (txtusuarioElement === 'Anónimo' || txtusuarioElement === undefined || txtusuarioElement === null) {
    await navegador.close();
    return [Error.LOGIN, 'Error no login'];
  }

  if (act === Accion.LOGIN) {
    await navegador.close();
    return [Error.NOERROR, `Login correcto co usuario ${txtusuarioElement}`];
  }

  // Vamos a entrar en la zona divs y retornar los ultimos divs marchados para descargar

  if (act === Accion.ULTIMOSDIVS) {
    await navegador.close();
    return [Error.NOERROR, ''];
  }

  await navegador.close();
  return [Error.NOERROR, 'd'];
}

void (async () => {
  const result = await ovgan('', '', Accion.LOGIN);
  console.log(result);
})();
