import gsap from "gsap";
function toPX(value: string) {
  return (
    (parseFloat(value) / 100) *
    (/vh/gi.test(value) ? window.innerHeight : window.innerWidth)
  );
}
const DEBUG = false;
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
  isFirstVisit: boolean,
  locale: string,
  isMobile: boolean
): Promise<void> => {
  return new Promise((resolve) => {
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
    const bannerWrapper = document.getElementById("banner-1");
    const footerLuva = document.querySelector(".footer_luva");
    const toMail = document.querySelectorAll(".toMail");
    const scrollIndicator = document.querySelectorAll(".scroll-indicator");
    const luvaWrapper = document.getElementById("wrapper_footer_luva");
    const footer_essencials = document.querySelector("#footer_essencials");
    const bannerLuva = document.querySelector("#banner_luva");
    const header = document.getElementById("header");
    const footer = document.getElementById("footer");
    debug("Enter: Elements found:", {
      bannerWrapper: !!bannerWrapper,
      footerLuva: !!footerLuva,
      toMail: toMail?.length,
      scrollIndicator: scrollIndicator?.length,
      luvaWrapper: !!luvaWrapper,
      footer_essencials: !!footer_essencials,
      bannerLuva: !!bannerLuva,
      header: !!header,
      footer: !!footer,
    });
    if (bannerWrapper) {
      const tl = gsap.timeline({
        onStart: () => debug("Enter animation timeline started"),
        onComplete: () => {
          debug("Enter animation timeline completed");
          resolve(); 
        },
        onUpdate: () => debug("Enter animation progress: " + tl.progress()),
      });
      const scalemobile = "10vh";
      const luvaOfsset = "0vh";
      const bannerBack = bannerWrapper.querySelector(".back");
      debug("Banner back element found:", !!bannerBack);
      debug(`Animation params: scalemobile=${scalemobile}, luvaOfsset=${luvaOfsset}`);
      gsap.set(bannerBack, { scale: 1, autoAlpha: 1 });
      gsap.set(bannerWrapper, {
        transformOrigin: "50% 100%",
        scale: 1,
        display: "flex",
      });
      gsap.set(footerLuva, {
        transformOrigin: "50% 100%",
        height: scalemobile,
        y: toPX(luvaOfsset),
        display: "flex",
      });
      gsap.set(bannerLuva, { height: scalemobile });
      debug("Initial gsap sets completed");
      if (isMatchingPath) {
        debug("Running matching path enter animation");
        tl.set(bannerLuva, { opacity: 0 })
          .to(
            footerLuva,
            {
              height: "0vh",
              y: 0,
              duration: 0.15,
              ease: "power3.inOut",
              opacity: 1,
              onComplete: () => {
                debug("Final footer animation completed");
                gsap.to(footer_essencials, {
                  y: 0,
                  duration: 0.15,
                  display: "flex",
                  autoAlpha: 1,
                });
                gsap.to(luvaWrapper, { display: "none" });
              },
            },
            "s"
          )
          .to(
            bannerBack,
            { scale: 1, autoAlpha: 0, duration: 0.1, ease: "none" },
            "f"
          )
          .to(bannerWrapper, { scale: 0, duration: 0.1, ease: "none" }, "a")
          .set(toMail, { display: "flex" })
          .fromTo(
            scrollIndicator,
            { y: 200, duration: 0.1, ease: "power3.inOut" },
            { y: 0 }
          )
          .set(luvaWrapper, { display: "none" });
      } else {
        debug("Running default enter animation");
        tl.set(bannerBack, { zIndex: 59 })
          .to([header], { zIndex: 62, duration: 1 }, "redo")
          .to([footer], { zIndex: 61, duration: 1 }, "redo")
          .set(bannerLuva, { opacity: 0 }, "+=1")
          .set(footerLuva, { autoAlpha: 1 }, "<")
          .to(
            footerLuva,
            {
              height: isMobile ? "0vh" : "10vh",
              y: 0,
              duration: 0.5,
              ease: "power3.inOut",
              opacity: 1,
            },
            "<"
          )
          .to(
            bannerBack,
            { scale: 1, autoAlpha: 0, duration: 0.1, ease: "none" },
            "f"
          )
          .to(bannerWrapper, { scale: 0, duration: 0.1, ease: "none" }, "a")
          .set(toMail, { display: "flex" })
          .to(
            scrollIndicator,
            { y: 0, opacity: 1, display: "flex", autoAlpha: 1 }
          );
      }
      debug("Timeline created and started");
    } else {
      debug("Fallback animation running - elements not found");
      const tween = gsap.fromTo(
        "body",
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          onStart: () => debug("Fallback enter animation started"),
          onComplete: () => {
            debug("Fallback enter animation completed");
            resolve(); 
          },
        }
      );
      return () => {
        debug("Fallback enter animation cleanup called");
        tween.kill();
      };
    }
  });
};
export const animatePageOut = (
  pathname: string,
  isMobile: boolean
): Promise<void> => {
  return new Promise((resolve) => {
    const isMatchingPath =
      pathname === "/production" ||
      pathname === "/about" ||
      pathname === "/residencias" ||
      pathname.startsWith("/projects/");
    debug(`Is matching path: ${isMatchingPath}, current path: ${pathname}`);
    const bannerWrapper = document.getElementById("banner-1");
    const footerLuva = document.querySelector(".footer_luva");
    const luvaWrapper = document.getElementById("wrapper_footer_luva");
    const footer_essencials = document.querySelector("#footer_essencials");
    const toMail = document.querySelectorAll(".toMail");
    const scrollIndicator = document.querySelectorAll(".scroll-indicator");
    const header = document.getElementById("header");
    const footer = document.getElementById("footer");
    debug("Leave: Elements found:", {
      bannerWrapper: !!bannerWrapper,
      footerLuva: !!footerLuva,
      luvaWrapper: !!luvaWrapper,
      footer_essencials: !!footer_essencials,
      toMail: toMail?.length,
      scrollIndicator: scrollIndicator?.length,
      header: !!header,
      footer: !!footer,
    });
    if (bannerWrapper) {
      const back = bannerWrapper.querySelector(".back");
      debug("Back element found:", !!back);
      const tl = gsap.timeline({
        onStart: () => debug("Leave animation timeline started"),
        onComplete: () => {
          debug("Leave animation timeline completed");
          resolve(); 
        },
        onUpdate: () => debug("Leave animation progress: " + tl.progress()),
      });
      const scalemobile = "10vh";
      const luvaOfsset = "0vh";
      debug(`Animation params: scalemobile=${scalemobile}, luvaOfsset=${luvaOfsset}`);
      gsap.set(bannerWrapper, {
        display: "flex",
        transformOrigin: "50% 100%",
        scale: 0,
      });
      gsap.set(back, { scale: 1, autoAlpha: 0 });
      gsap.set(header, { opacity: 1, autoAlpha: 1 });
      gsap.set(footer, { opacity: 1, autoAlpha: 1 });
      gsap.set(luvaWrapper, { display: "flex" });
      debug("Initial gsap sets completed");
      if (isMatchingPath) {
        debug("Running matching path leave animation");
        tl.to(scrollIndicator, { opacity: 0, duration: 0.1, display: "none", ease: "power3.inOut" })
          .set(toMail, { display: "none" })
          .to(footer_essencials, { y: 200, duration: 0.1, display: "flex" })
          .to(
            bannerWrapper,
            { scale: 1, duration: 0.1, ease: "power3.inOut" },
            "A"
          )
          .to(back, { scale: 1, autoAlpha: 1, duration: 0.1, ease: "none" }, "c")
          .set(footerLuva, {
            display: "flex",
            transformOrigin: "50% 100%",
            height: "10vh",
            opacity: 1,
          })
          .set(luvaWrapper, { display: "flex" })
          .to(
            footerLuva,
            {
              height: scalemobile,
              y: toPX(luvaOfsset),
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
      } else {
        debug("Running default leave animation");
        tl.set(footer, { mixBlendMode: "normal" })
          .to(footer_essencials, { y: 200, autoAlpha: 1, duration: 0.75 })
          .to(scrollIndicator, { display: "none", duration: 0.25, ease: "power3.inOut" })
          .set(toMail, { display: "none" })
          .to(
            bannerWrapper,
            { scale: 1, duration: 0.1, ease: "power3.inOut" },
            "a"
          )
          .to(back, { scale: 1, autoAlpha: 1, duration: 0.1, ease: "none" }, "c")
          .to(
            footerLuva,
            {
              height: scalemobile,
              y: toPX(luvaOfsset),
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
      debug("Timeline created and started");
    } else {
      debug("Fallback animation running - elements not found");
      const tween = gsap.fromTo(
        "body",
        { autoAlpha: 1 },
        {
          autoAlpha: 0,
          onStart: () => debug("Fallback leave animation started"),
          onComplete: () => {
            debug("Fallback leave animation completed");
            resolve(); 
          },
        }
      );
      return () => {
        debug("Fallback leave animation cleanup called");
        tween.kill();
      };
    }
  });
};