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
  LOGIN // ERRO O FACER LONGIN
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
  const response: HTTPResponse | null = await pagina.waitForResponse(URLS.LOGIN);

  if (response == null || response.status() !== 200) {
    return [Error.URLLOGIN, ''];
  }

  // Capturamos botones de login y enviamos peticion
  const username: ElementHandle<Element> | null = await pagina.$('[name="username"]');
  const pass: ElementHandle<Element> | null = await pagina.$('[name="password"]');
  const btnEnviar: ElementHandle<Element> | null = await pagina.$('#botonentrarlogin');

  if (username == null || pass == null || btnEnviar == null) {
    return [Error.ERRORELEMNTOSLOGIN, ''];
  }

  await username.click();
  await username.type(user);
  await pass.click();
  await pass.type(password);
  await btnEnviar.click();

  // Esperamos 5 segundos a que resolva a peticion
  await new Promise(resolve => setTimeout(resolve, 5000));

  const usuarioElement = await pagina.$('#header-user-name span');
  const txtusuarioElement: string | null | undefined = await usuarioElement?.evaluate(element => element.textContent);

  if (txtusuarioElement === 'Anónimo' || txtusuarioElement === undefined || txtusuarioElement === null) {
    return [Error.LOGIN, 'Login incorrecto'];
  }

  if (act === Accion.LOGIN) {
    return [Error.NOERROR, 'Login correcto'];
  }

  // Empezamos con las gestiones de datos

  if (act === Accion.ULTIMOSDIVS) {
    return [Error.NOERROR, ''];
  }

  return [Error.NOERROR, 'd'];
}

void ovgan('', '', Accion.LOGIN);
