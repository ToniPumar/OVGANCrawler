export enum Accion {
  LOGIN,
  ULTIMOSDIVS,
  ULTIMOSFICHEIROS,
  DECLAMOVEMENTO,
  ALTANACEMENTO
}

export enum Error {
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

export enum URLS {
  LOGIN = 'https://ovgan.xunta.gal/ovgan/pin/login',
  ALTAPORNACEMENTO = 'https://ovgan.xunta.gal/ovgan/gl/index.html#/misAltasNacimiento/solicitud',
  DECLARACIONDEMOVEMENTO = 'https://ovgan.xunta.gal/ovgan/gl/index.html#/misDeclaracionMovimientosEntradas/solicitud',
  ULTIMOSDIVS = 'https://ovgan.xunta.gal/ovgan/gl/index.html#/dibs'
}
