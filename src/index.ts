import puppeteer, { Browser, Page } from 'puppeteer'

/* Esta funcion se está preparando para despues poderse eejcutar en firebase
   no dividiremos el código en varias funciónes si no que intentaremo hacerlo todo con una sola
   para garantizar que cada instancia de navegador se ejecuta por separado
*/

enum Accion
{
  LOGIN = 0,
  ULTIMOSDIVS = 1,
  DECLAMOVEMENTO = 2,
  ALTANACEMENTO = 3
}

async function ovgan (user: string = '', password: string = '', act: Accion = Accion.LOGIN): Promise<string>
{
  const navegador: Browser = await puppeteer.launch();
  const pagina: Page = await navegador.newPage();
  await pagina.goto("https://ovgan.xunta.gal/ovgan/pin/login ");

  return 'adfadf';
}
