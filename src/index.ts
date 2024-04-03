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
  ERRORINFOUSUARIO,
  ERRORALTANACEMENTO,
  ERRORURLALTANACEMENTO,
  ERRORELEMENTOSALTANACEMENTO1
}

enum URLS {
  LOGIN = 'https://ovgan.xunta.gal/ovgan/pin/login',
  ALTAPORNACEMENTO = 'https://ovgan.xunta.gal/ovgan/gl/index.html#/misAltasNacimiento/solicitud',
  DECLARACIONDEMOVEMENTO = 'https://ovgan.xunta.gal/ovgan/gl/index.html#/misDeclaracionMovimientosEntradas/solicitud',
  ULTIMOSDIVS = 'https://ovgan.xunta.gal/ovgan/gl/index.html#/dibs'
}

async function ovgan (user: string = '', password: string = '', act: Accion = Accion.LOGIN, dataOperacion?: string, rega?: string): Promise<[Error, string]> {
  const navegador: Browser = await puppeteer.launch({ headless: false });
  const pagina: Page = await navegador.newPage();
  let response: HTTPResponse | null = await pagina.goto(URLS.LOGIN);

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

  /**
   * Vamos a empezar ca declaración de movementos, fai falta a data de saida( id = fecha-nacimiento) e o rega (id=codigoRegaOrigDest)
   * destino na primeira pantalla cando o rega e correcto engadeselle a class ng-valid, texto explotacion destino .texto-explotacion-tipo span (- se non encontra)
   * <a _ngcontent-ayy-c115="" data-toggle="tooltip" title="" data-original-title="Ir ó paso seguinte" class="ng-star-inserted"> Boton seguinte
   * Na segunda pantalla fai falta id="crotal"
  */

  if (act === Accion.ALTANACEMENTO) {
    if (dataOperacion?.length === 0 || rega?.length === 0) {
      await navegador.close();
      return [Error.ERRORALTANACEMENTO, 'Falta de data ou REGA'];
    }

    response = await pagina.goto(URLS.ALTAPORNACEMENTO);

    if (response === null || response.status() !== 200) {
      await navegador.close();
      return [Error.ERRORURLALTANACEMENTO, 'Erro Cargando a url de alta por nacemento '];
    }

    await new Promise(resolve => setTimeout(resolve, 5000));

    const inputdataOperacion: ElementHandle<Element> | null = await pagina.$('#fecha-nacimiento');
    const inputRega: ElementHandle<Element> | null = await pagina.$('#codigoRegaOrigDest');

    if (inputdataOperacion == null || inputRega == null) {
      await navegador.close();
      return [Error.ERRORELEMENTOSALTANACEMENTO1, 'Error cargando elemntos alta nacemento paxina 1'];
    }

    await inputdataOperacion.click();
    await inputdataOperacion.type(dataOperacion ?? '');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await inputRega.click();
    await inputRega.type(rega ?? '');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await pagina.keyboard.press('Tab');
    await new Promise(resolve => setTimeout(resolve, 6000));
    await navegador.close();
    return [Error.NOERROR, 'Alta de nacemento feita'];
  }
  await navegador.close();
  return [Error.NOERROR, 'd'];
}

void (async () => {
  const result = await ovgan('', '', Accion.LOGIN);
  console.log(result);
})();
