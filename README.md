<!--
*** This readme is inspired by the Best-README-Template available at https://github.com/othneildrew/Best-README-Template. Thanks to othneildrew for the inspiration!
-->


<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
<!-- [![Forks][forks-shield]][forks-url] -->


<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/Bennett-Wendorf/C0de010gy">
    <img src="frontend/public/code-solid.svg" alt="Logo" width="100" height="100">
  </a>

  <h1 align="center">C0de010gy</h3>

  <p align="center">
    Welcome to C0de010gy, an event management system for non-profits! A previous version of this project (through <a href="https://github.com/Bennett-Wendorf/C0de010gy/commit/c6ff352bcee4e8b84407302848682e90cb4eedfa">this</a> commit) was a semester-long project for a graduate-level university course.
    <br/>
    <a href="https://github.com/Bennett-Wendorf/C0de010gy"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/Bennett-Wendorf/C0de010gy/issues">Report Bug</a>
    ·
    <a href="https://github.com/Bennett-Wendorf/C0de010gy/issues">Request Feature</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

A previous version of this project (through <a href="https://github.com/Bennett-Wendorf/C0de010gy/commit/c6ff352bcee4e8b84407302848682e90cb4eedfa">this</a> commit) was a semester-long project for a graduate-level university course. It is designed as an event management system for non-profit organizations, allowing scheduling of events with locations, times, etc. In addition, it allows individuals to volunteer to help out for events, and make donations to specific events or the organization as a whole.

### Built With

This project is written in Node.js for the backend and React.js for the frontend, with the use of some other packages to aid development. 
* [Node.js](https://nodejs.org/en/)
* [React.js](https://reactjs.org/)
* [React Material Design Library](https://mui.com/)
* [Mariadb](https://mariadb.org/)



<!-- GETTING STARTED -->
## Getting Started

For now, there is no installer or prepackaged installation for this project. Follow the instructions below to get the project running on your system.

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/Bennett-Wendorf/C0de010gy.git
   ```
2. Install dependencies
    * In the frontend directory use npm to install the requirements for the frontend.
      ```sh
      cd frontend
      npm install
      ```
    * Then do the same for the backend.
      ```sh
      cd ../backend
      npm install
      ```
    OR
    * If you wish to use the application as is, you only need to install the backend requirements, as the `build` directory in the backend will host the pages for the frontend.
3. Run the app
    * If you wish to run the prebuilt frontend from the backend, you can do the following to run the backend server and host the frontend from it.
      ```sh
      cd backend
      npm start
      ```
    OR
    * If you wish to run the backend and frontend separately, do the following in two separate terminals:
      ```sh
      cd frontend
      npm start
      ```
      ```sh
      cd backend
      npm run dev OR npm start
      ```
    
4. Create your own frontend build
    * You can also check out [this guide](https://create-react-app.dev/docs/production-build/) on how to create that build folder if you make modifications to the frontend. 


<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

If you find an issue in existing code, feel free to use the above procedure to generate a change, or open an [issue](https://github.com/Bennett-Wendorf/C0de010gy/issues) for me to fix it.


<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.



<!-- CONTACT -->
## Contact

Bennett Wendorf - [Website](https://bennettwendorf.dev/) - bennettwendorf@gmail.com

Project Link: [https://github.com/Bennett-Wendorf/C0de010gy](https://github.com/Bennett-Wendorf/C0de010gy)



<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements
* [Img Shields](https://shields.io)
* [Node.js](https://nodejs.org/en/)
* [React.js](https://reactjs.org/)
* [React Material Design Library](https://mui.com/)
* [Mariadb](https://mariadb.org/)
* [Create React App](https://create-react-app.dev/)



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/bennett-wendorf/C0de010gy.svg?style=flat&color=informational
[contributors-url]: https://github.com/bennett-wendorf/C0de010gy/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/bennett-wendorf/C0de010gy.svg?style=flat
[forks-url]: https://github.com/bennett-wendorf/C0de010gy/network/members
[stars-shield]: https://img.shields.io/github/stars/bennett-wendorf/C0de010gy.svg?style=flat&color=yellow
[stars-url]: https://github.com/bennett-wendorf/C0de010gy/stargazers
[issues-shield]: https://img.shields.io/github/issues/bennett-wendorf/C0de010gy.svg?style=flat&color=red
[issues-url]: https://github.com/bennett-wendorf/C0de010gy/issues
[license-shield]: https://img.shields.io/github/license/bennett-wendorf/C0de010gy.svg?style=flat
[license-url]: https://github.com/bennett-wendorf/C0de010gy/blob/master/LICENSE
