//utils/animations.ts

// import { Locale } from "@/i18n/routing";
import gsap from "gsap";
// import { useLocale } from "next-intl";
// import {GSDevTools} from "gsap/GSDevTools";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
function toPX(value: string) {
  return (
    (parseFloat(value) / 100) *
    (/vh/gi.test(value) ? window.innerHeight : window.innerWidth)
  );
}

// gsap.registerPlugin(GSDevTools)
// Page In Animation (scaling back to bottom-center)
export const animatePageIn = (
  pathname: string | undefined,
  isFirstVisit: boolean,
  locale: string,
  isMobile: boolean
) => {
  if (!pathname) {
    // Handle cases where pathname is undefined
    return null; // Or some fallback UI
  }
  const isMatchingPath =
    pathname === `/production` ||
    pathname === `/about` ||
    pathname === `/residencias` ||
    pathname.startsWith(`/projects/`);
  const bannerWrapper = document.getElementById("banner-1");
  const footerLuva = document.querySelector(".footer_luva");
  const toMail = document.querySelectorAll(".toMail");
  const scrollIndicator = document.querySelectorAll(".scroll-indicator");
  const luvaWrapper = document.getElementById("wrapper_footer_luva");
  const footer_essencials = document.querySelector("#footer_essencials");
  const bannerLuva = document.querySelector("#banner_luva");
  const header = document.getElementById("header");
  const footer = document.getElementById("footer");

  if (bannerWrapper) {
    const tl = gsap.timeline();
    const scalemobile = "30vh";
    // const scaleOut = isMobile ? "0vh" : "10vh";
    const luvaOfsset = isMobile ? "-50vh" : "-40vh";
    const bannerBack = bannerWrapper.querySelector(".back");
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

    // console.log(bannerLuva, "HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH");
    // console.log("Animating Page In for pathname:", pathname);

 
    if (isMatchingPath) {
      tl.set(bannerLuva, { opacity: 0 })
        .to(
          footerLuva,
          {
            height: "0vh",
            y: 0,
            duration: 0.25,
            ease: "power3.inOut",
            opacity: 1,
            onComplete: () => {
              gsap.to(footer_essencials, {
                y: 0,
                duration: 0.25,
                display: "flex",
                autoAlpha: 1,
              }); // Hide footerLuva after it fades out
              gsap.to(luvaWrapper, { display: "none" });
              // console.log(
              //   luvaWrapper,
              //   "GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG"
              // );
              // gsap.set(footerLuva, { display: "none" }); // Hide banner after animation
            },
          },
          "s"
        )
        .to(
          bannerBack,
          { scale: 1, autoAlpha: 0, duration: 0.25, ease: "none" },
          "f"
        )
        .to(bannerWrapper, { scale: 0, duration: 0.25, ease: "none" }, "a")
        // .set(luvaWrapper,{ backgroundColor: "gray", autoAlpha: 0 }) // Hide footerLuva after it fades out
        .set(toMail, { display: "flex" })
        .fromTo(
          scrollIndicator,
          { y: 200, duration: 0.25, ease: "power3.inOut" },
          { y: 0 }
        )
        .set(luvaWrapper, { display: "none" });
    } else {
      tl.set(bannerBack, { zIndex: 59 })
        // .set(header, { zIndex: 60 })
        // .set(footer, { zIndex: 60 })
        // .set(bannerLuva, {autoAlpha: 1}, "+=2")
        .to([header], { zIndex: 62, duration: 0.1 }, "redo")
        .to([footer], { zIndex: 61, duration: 0.1 }, "redo")

        .set(bannerLuva, { opacity: 0 }, "+=3")
        .set(footerLuva, { autoAlpha: 1 }, "<")
        .to(
          footerLuva,
          {
            height: isMobile ? "0vh" : "10vh",
            y: 0,
            duration: 0.25,
            ease: "power3.inOut",
            opacity: 1,
          },
          "<"
        )
        .to(
          bannerBack,
          { scale: 1, autoAlpha: 0, duration: 0.25, ease: "none" },
          "f"
        )
        .to(bannerWrapper, { scale: 0, duration: 0.25, ease: "none" }, "a")
        .set(toMail, { display: "flex" })
        .to(
          scrollIndicator,
          { y: 0, opacity: 1, display: "flex",autoAlpha: 1 }
        )
        ;
    }

    // if (pathname === "/production" || pathname === "/about" || pathname === "/residencias") {
    //   tl.set(luvaWrapper, { display: "none" })
    //   .from(footer_essencials,{ y:200, duration:1}) // Hide footerLuva after it fades out
    //   .set(footer_essencials,{display: "flex", y:0,}); // Hide footerLuva after it fades out
    // }
  } else {
    console.error("bannerWrapper or footerLuva element not found in DOM.");
  }
};
// Page Out Animation (scaling from bottom-center to full screen)
export const animatePageOut = (
  href: string,
  router: AppRouterInstance,
  pathname: string,
  isMobile: boolean
) => {
  // const locale = useLocale();

  const isMatchingPath =
    pathname === `/production` ||
    pathname === `/about` ||
    pathname === `/residencias` ||
    pathname.startsWith(`/projects/`);

  const bannerWrapper = document.getElementById("banner-1");
  const footerLuva = document.querySelector(".footer_luva");
  const luvaWrapper = document.getElementById("wrapper_footer_luva");
  const footer_essencials = document.querySelector("#footer_essencials");
  const toMail = document.querySelectorAll(".toMail");
  const scrollIndicator = document.querySelectorAll(".scroll-indicator");
  const header = document.getElementById("header");
  const footer = document.getElementById("footer");

  if (!pathname) {
    // Handle cases where pathname is undefined
    return null; // Or some fallback UI
  }
  if (bannerWrapper) {
    // alert(pathname)
    const back = bannerWrapper.querySelector(".back");
    const tl = gsap.timeline();
    const scalemobile = "30vh";
    // const scaleOut = isMobile ? "0vh" : "10vh";
    const luvaOfsset = isMobile ? "-50vh" : "-40vh";
    gsap.set(bannerWrapper, {
      display: "flex",
      transformOrigin: "50% 100%",
      scale: 0,
    });
    gsap.set(back, { scale: 1, autoAlpha: 0 });
    gsap.set(header, { opacity: 1, autoAlpha: 1 });
    gsap.set(footer, { opacity: 1, autoAlpha: 1 });
    gsap.set(luvaWrapper, { display: "flex" });
    // gsap.set(footerLuva, { display: "flex", transformOrigin: "50% 100%", scale: 1 , opacity: 1});
    if (isMatchingPath) {
      // gsap.set(luvaWrapper, {display: "flex",backgroundColor: "pink",autoAlpha:1, scale: 1});
      tl.to(scrollIndicator, { opacity: 0, duration: 0.25, display:"none", ease: "power3.inOut" })
        .set(toMail, { display: "none" })
        .to(footer_essencials, { y:0, duration: 0.25, display: "none" })
        // .set(luvaWrapper,{autoAlpha:1,backgroundColor: "green", onComplete: () => {alert("hello")}})
        // .to(luvaWrapper,{ duration:1, ease: "none", display:"flex"})
        // .set(toMail, {display: "none"})
        .to(
          bannerWrapper,
          { scale: 1, duration: 0.25, ease: "power3.inOut" },
          "A"
        )
        .to(back, { scale: 1, autoAlpha: 1, duration: 0.25, ease: "none" }, "c")
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
            duration: 0.25,
            ease: "power3.inOut",
            opacity: 1,
            // backgroundColor: "#abcef0",
            onComplete: () => {
              router.push(href);
            },
          },
          "s"
        );
    } else {
      tl.set(footer, {mixBlendMode:"normal"})
        .to(footer_essencials, { y: 0, display: "flex", duration: 0.1 })
        .to(scrollIndicator, { display: "none" , duration: 0.25, ease: "power3.inOut" })
        .set(toMail, { display: "none" })
        .to(
          bannerWrapper,
          { scale: 1, duration: 0.25, ease: "power3.inOut" },
          "a"
        )
        .to(back, { scale: 1, autoAlpha: 1, duration: 0.25, ease: "none" }, "c")
        .to(
          footerLuva,
          {
            height: scalemobile,
            y: toPX(luvaOfsset),
            duration: 0.25,
            ease: "power3.inOut",
            opacity: 1,
            // backgroundColor: "yellow",
            onComplete: () => {
              router.push(href);
            },
          },
          "s"
        );
    }
    console.log("Animating Page Out for pathname:", pathname, href);
  } else {
    console.error("bannerWrapper or footerLuva element not found in DOM.");
  }
};
