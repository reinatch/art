import gsap from "gsap";

// function toPX(value: string) {
//   return (
//     (parseFloat(value) / 100) *
//     (/vh/gi.test(value) ? window.innerHeight : window.innerWidth)
//   );
// }

const DEBUG =  false;
const debug = (message: string, data?: unknown) => {
  if (DEBUG) {
    if (data) {
      console.log(`[DEBUG] ${message}`, data);
    } else {
      console.log(`[DEBUG] ${message}`);
    }
  }
};

export const animatePageIn = (
  pathname: string | undefined,
  // optional params kept for backwards compatibility with callers
  _isFirstVisit?: boolean,
  _locale?: string | null,
  _isMobile?: boolean,
): Promise<void> => {
  return new Promise((resolve) => {
    // avoid unused var TS errors for optional compatibility params
    void _isFirstVisit;
    void _locale;
    void _isMobile;

    if (!pathname) {
      debug("No pathname provided for animation");
      resolve();
      return;
    }

    const isMatchingPath =
      pathname === "/production" ||
      pathname === "/about" ||
      pathname === "/residencias" ||
      pathname.startsWith("/projects/");

    debug(`Is matching path: ${isMatchingPath}, current path: ${pathname}`);

    const footerLuva = document.querySelector(".footer_luva");
    const toMail = document.querySelectorAll(".toMail");
    const scrollIndicator = document.querySelectorAll(".scroll-indicator");
    const luvaWrapper = document.getElementById("wrapper_footer_luva");
    const footerEssentials = document.querySelector("#footer_essencials");
    const header = document.getElementById("header");
    const footer = document.getElementById("footer");

    debug("Enter: Elements found:", {
      footerLuva: !!footerLuva,
      toMail: toMail?.length,
      scrollIndicator: scrollIndicator?.length,
      luvaWrapper: !!luvaWrapper,
      footerEssentials: !!footerEssentials,
      header: !!header,
      footer: !!footer,
    });

    const tl = gsap.timeline({
      onComplete: () => {
        debug("Enter animation timeline completed");
        resolve();
      },
    });

    // const scalemobile = "10vh";
    // const luvaOffset = isMobile ? "-50vh" : "0vh";

    // Set initial states
    if (!isMatchingPath) {
    gsap.set(footerLuva, {
      transformOrigin: "50% 100%",
      // height: scalemobile,
      // y: toPX(luvaOffset),
      display: "flex",
    });
  }
    if (isMatchingPath) {
      debug("Running matching path enter animation");

      tl.to(
        footerLuva,
        {
          // height: "0px",
          // y: 0,
          duration: 0.15,
          opacity: 0,
          onComplete: () => {
            debug("footerLuva animation completed");
            // gsap.set(footerLuva, { display: "none" }); // Ensure it's hidden
          },
        },
      )
        .to(
          footerEssentials,
          {
            y: 0,
            duration: 0.15,
            display: "flex",
            autoAlpha: 1,
            onStart: () => {
              debug("footerEssentials animation started");
            },
          },
        )
        .set(toMail, { display: "flex" })
        .fromTo(
          scrollIndicator,
          { y: 200, duration: 0.1, ease: "power3.inOut" },
          { y: 0 }
        )
        .set(luvaWrapper, { display: "none" });
    } else {
      debug("Running default enter animation");

      tl.to(footerLuva, { autoAlpha: 1, duration: 0.5 })
        .to([header], { zIndex: 62, duration: 1 }, "redo")
        .to([footer], { zIndex: 61, duration: 1 }, "redo")
        .to(
          footerLuva,
          {
            // height: isMobile ? "0vh" : "10vh",
            // y: 0,
            duration: 0.5,
            ease: "power3.inOut",
            opacity: 1,
          },
        )
        .set(toMail, { display: "flex" })
        .to(
          scrollIndicator,
          { y: 0, opacity: 1, display: "flex", autoAlpha: 1 }
        );
    }
  });
};

export const animatePageOut = (
  pathname: string,
  // isMobile: boolean,
): Promise<void> => {
  return new Promise((resolve) => {
    const isMatchingPath =
      pathname === "/production" ||
      pathname === "/about" ||
      pathname === "/residencias" ||
      pathname.startsWith("/projects/");

    debug(`Is matching path: ${isMatchingPath}, current path: ${pathname}`);

    const footerLuva = document.querySelector(".footer_luva");
    const luvaWrapper = document.getElementById("wrapper_footer_luva");
    const footerEssentials = document.querySelector("#footer_essencials");
    const toMail = document.querySelectorAll(".toMail");
    const scrollIndicator = document.querySelectorAll(".scroll-indicator");
    const header = document.getElementById("header");
    const footer = document.getElementById("footer");

    debug("Leave: Elements found:", {
      footerLuva: !!footerLuva,
      luvaWrapper: !!luvaWrapper,
      footerEssentials: !!footerEssentials,
      toMail: toMail?.length,
      scrollIndicator: scrollIndicator?.length,
      header: !!header,
      footer: !!footer,
    });

    const tl = gsap.timeline({
      onComplete: () => {
        debug("Leave animation timeline completed");
        resolve();
      },
    });

    // const scalemobile = "10vh";
    // const luvaOffset = isMobile ? "-50vh" : "0vh";

    // Set initial states
    gsap.set(footerLuva, {
      display: "flex",
      transformOrigin: "50% 100%",
      // height: "10vh",
      opacity: 1,
    });
    gsap.set(header, { opacity: 1, autoAlpha: 1 });
    gsap.set(footer, { opacity: 1, autoAlpha: 1 });
    gsap.set(luvaWrapper, { display: "flex" });

    if (isMatchingPath) {
      debug("Running matching path leave animation");

      tl.to(scrollIndicator, { opacity: 0, duration: 0.1, display: "none", ease: "power3.inOut" })
        .set(toMail, { display: "none" })
        .to(footerEssentials, { y: 200, duration: 0.1, display: "flex" })
        .to(
          footerLuva,
          {
            // height: scalemobile,
            // y: toPX(luvaOffset),
            duration: 0.75,
            ease: "power3.inOut",
            opacity: 1,
            onStart: () => debug("Final footer animation started"),
            onComplete: () => {
              debug("Final footer animation completed");
            },
          },
        );
    } else {
      debug("Running default leave animation");

      tl.to(scrollIndicator, { display: "none", duration: 0.25, ease: "power3.inOut" })
        .set(toMail, { display: "none" })
        .to(footerEssentials, { y: 200, duration: 0.1, display: "flex" })
        .to(
          footerLuva,
          {
            // height: scalemobile,
            // y: toPX(luvaOffset),
            duration: 0.75,
            ease: "power3.inOut",
            opacity: 1,
            onStart: () => debug("Final footer animation started"),
            onComplete: () => {
              debug("Final footer animation completed");
            },
          },
          "s"
        );
    }
  });
};