# noThanks

<center><img src="https://i.imgur.com/mCGfTcn.png" width="300" align="center"></center>
<br/>

- 🇨🇴 [Español](#nothanks-español)
  - [Funcionalidades](#funcionalidades)
  - [Notas de uso](#notas-de-uso-importante)
  - [Privacidad y seguridad](#privacidad-y-seguridad)
  - [Licencia](#-licencia)
- 🇺🇸 [English](#nothanks-english)
  - [Features](#features)
  - [Usage notes](#usage-notes-important)
  - [Privacy & Security](#privacy--security)
  - [License](#license)

---

## noThanks 🇺🇸

Browser extension that lets you **hide job offers from unwanted companies** on job search portals such as **LinkedIn, Indeed, and Computrabajo**.
Designed for people who want to clean up their search results, avoid repeated companies, recruitment agencies, or companies they’ve had bad experiences with before.

<center><img src="https://i.imgur.com/Ny8jHCD.png" width="300" align="center"></center>

### Features

- Custom company blacklist
- Automatic job offer filtering
- Supports:
  - LinkedIn Jobs
  - Indeed
  - Computrabajo
- Global toggle On / Off
- Simple interface from the popup
- Works 100% locally (no servers involved)
- Compatible with infinite scroll

### How it works?

1. The extension injects a **content script** into supported job portals
2. It detects job cards in the DOM
3. It extracts the company name
4. If the company is on the blacklist → the job offer is hidden
5. The process runs dynamically whenever new offers are loaded

### Usage notes (Important)

- This extension **does not block companies or listings at the network level**; it only **hides job cards visually**.
- Filtering is based on the **visible company name**, therefore:
  - Name variations may require adjusting the blacklist.
  - Partial names are recommended (e.g. `accenture` instead of `Accenture S.A.`).
- Job portals may **change their layout** at any time; filtering rules might need updates.
- When disabling the filter, the page **is no longer modified**, but previously hidden jobs may require a page reload.

### Privacy & Security

✔ No data collection  
✔ No third-party requests  
✔ No trackers or analytics  
✔ No automated interactions  
✔ Visual DOM manipulation only

All processing happens **locally in the user's browser**.

### License

MIT – free for personal and educational use.

---

## noThanks 🇨🇴

Extensión de navegador que permite **ocultar ofertas de empleo de empresas no deseadas** en portales de búsqueda laboral como **LinkedIn, Indeed y Computrabajo**.

Pensada para personas que quieren **limpiar resultados**, evitar empresas repetidas, consultoras o compañías con malas experiencias previas.

<center><img src="https://i.imgur.com/Ny8jHCD.png" width="300" align="center"></center>

### Funcionalidades

- Blacklist personalizada de empresas
- Filtrado automático de ofertas
- Soporte para:
  - LinkedIn Jobs
  - Indeed
  - Computrabajo
- Toggle global **Activado / Desactivado**
- Interfaz simple desde popup
- Funciona 100% local (sin servidores)
- Compatible con scroll infinito

### Cómo funciona?

1. La extensión inyecta un **content script** en los portales compatibles
2. Detecta las tarjetas de empleo en el DOM
3. Extrae el nombre de la empresa
4. Si la empresa está en la blacklist → la oferta se oculta
5. El proceso se repite dinámicamente cuando se cargan nuevas ofertas

### Notas de uso (Importante)

- Esta extensión **no bloquea empresas ni ofertas a nivel de red**; solo **oculta visualmente** las ofertas en la página.
- El filtrado se basa en el **nombre visible de la empresa**, por lo que:
  - Variaciones de nombre pueden requerir ajustar la blacklist.
  - Se recomienda usar nombres parciales (ej. `accenture` en lugar de `Accenture S.A.`).
- Los portales de empleo pueden **cambiar su diseño** en cualquier momento; si el filtrado deja de funcionar, puede requerir actualización.
- Al desactivar el filtro, la extensión **no modifica el contenido del sitio**, pero las ofertas ocultas previamente pueden requerir recargar la página.

### Licencia

MIT – libre para uso personal y educativo.

---

> ⚠️ **Note**  
> This project is still under active development.  
> If you have any suggestions, feedback, or encounter any issues, feel free to open an issue or report it.
