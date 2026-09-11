<script>
  /* =====================================================
     CYBER SECURITY LOADER
  ===================================================== */

  document.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById("cyberLoader");
    const percent = document.getElementById("loaderPercent");
    const progress = document.getElementById("loaderProgress");
    const terminal = document.getElementById("loaderTerminal");

    if (!loader || !percent || !progress) return;

    const circumference = 2 * Math.PI * 92;

    progress.style.strokeDasharray = circumference;
    progress.style.strokeDashoffset = circumference;

    const messages = [
      "> INITIALIZING CORE...",
      "> ESTABLISHING SECURE CONNECTION...",
      "> VERIFYING SYSTEM INTEGRITY...",
      "> LOADING TEAM 0001...",
      "> ENCRYPTING DATA STREAM...",
      "> ACCESS GRANTED...",
      "> SYSTEM READY..."
    ];

    let current = 0;

    function updateTerminal(value) {
      if (!terminal) return;

      const index = Math.min(
        Math.floor(value / 15),
        messages.length - 1
      );

      if (messages[index] !== messages[current]) {
        current = index;

        terminal.style.opacity = "0";

        setTimeout(() => {
          terminal.textContent = messages[index];
          terminal.style.opacity = "1";
        }, 60);
      }
    }

    function setProgress(value) {
      percent.textContent = value;

      const offset =
        circumference -
        (value / 100) * circumference;

      progress.style.strokeDashoffset = offset;

      updateTerminal(value);
    }

    let value = 0;

    const loaderInterval = setInterval(() => {
      /*
       * Variable speed makes the loader feel
       * more like a real system boot sequence.
       */
      let increment;

      if (value < 35) {
        increment = Math.floor(Math.random() * 3) + 1;
      } else if (value < 75) {
        increment = Math.floor(Math.random() * 4) + 1;
      } else if (value < 95) {
        increment = Math.floor(Math.random() * 2) + 1;
      } else {
        increment = 1;
      }

      value += increment;

      if (value >= 100) {
        value = 100;
        clearInterval(loaderInterval);

        setProgress(100);

        /*
         * Final cybersecurity glitch
         */
        setTimeout(() => {
          loader.classList.add("glitch");
        }, 150);

        /*
         * Remove loader
         */
        setTimeout(() => {
          loader.classList.add("loaded");

          document.body.classList.add("page-ready");

          setTimeout(() => {
            loader.remove();
          }, 900);

        }, 650);
      } else {
        setProgress(value);
      }
    }, 45);
  });
</script>
