// Copy pasted from: https://github.com/InseeFrLab/keycloakify/blob/main/src/login/Template.tsx

import { useState } from "react";
import { assert } from "keycloakify/tools/assert";
import { clsx } from "keycloakify/tools/clsx";
import { usePrepareTemplate } from "keycloakify/lib/usePrepareTemplate";
import { type TemplateProps } from "keycloakify/login/TemplateProps";
import { useGetClassName } from "keycloakify/login/lib/useGetClassName";
import type { KcContext } from "./kcContext";
import type { I18n } from "./i18n";
import { motion } from "framer-motion";

import TimerLoader from "@/components/timer/TimerLoader";

export default function Template(props: TemplateProps<KcContext, I18n>) {
  const {
    displayInfo = false,
    displayMessage = true,
    displayRequiredFields = false,
    displayWide = false,
    showAnotherWayIfPresent = true,
    // headerNode,
    showUsernameNode = null,
    infoNode = null,
    kcContext,
    i18n,
    doUseDefaultCss,
    classes,
    children,
  } = props;

  const { getClassName } = useGetClassName({ doUseDefaultCss, classes });

  const { msg, changeLocale, labelBySupportedLanguageTag, currentLanguageTag } =
    i18n;

  const { realm, locale, auth, url, message, isAppInitiatedAction } = kcContext;

  const { isReady } = usePrepareTemplate({
    doFetchDefaultThemeResources: doUseDefaultCss,
    styles: [
      `${url.resourcesCommonPath}/node_modules/patternfly/dist/css/patternfly.min.css`,
      `${url.resourcesCommonPath}/node_modules/patternfly/dist/css/patternfly-additions.min.css`,
      `${url.resourcesCommonPath}/lib/zocial/zocial.css`,
      `${url.resourcesPath}/css/login.css`,
    ],
    scripts: [],
    htmlClassName: getClassName("kcHtmlClass"),
    bodyClassName: getClassName("kcBodyClass"),
  });

  useState(() => {
    document.title = i18n.msgStr("loginTitle", kcContext.realm.displayName);
  });

  if (!isReady) {
    return null;
  }

  return (
    <div className={"mt-0"}>
      <div className={"flex justify-center"}>
        <TimerLoader size={800} strokeWidth={35} time={3} mode="white" />
      </div>

      <motion.div
        className={clsx(
          getClassName("kcFormCardClass"),
          displayWide && getClassName("kcFormCardAccountClass"),
          "bg-transparent shadow-lg"
        )}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: "easeIn", duration: 1.2 }}
      >
        <header className={getClassName("kcFormHeaderClass")}>
          {realm.internationalizationEnabled &&
            (assert(locale !== undefined), true) &&
            locale.supported.length > 1 && (
              <div id="kc-locale">
                <div
                  id="kc-locale-wrapper"
                  className={getClassName("kcLocaleWrapperClass")}
                >
                  <div className="kc-dropdown" id="kc-locale-dropdown">
                    <a href="#" id="kc-current-locale-link">
                      {labelBySupportedLanguageTag[currentLanguageTag]}
                    </a>
                    <ul>
                      {locale.supported.map(({ languageTag }) => (
                        <li key={languageTag} className="kc-dropdown-item">
                          <a href="#" onClick={() => changeLocale(languageTag)}>
                            {labelBySupportedLanguageTag[languageTag]}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          {!(
            auth !== undefined &&
            auth.showUsername &&
            !auth.showResetCredentials
          ) ? (
            displayRequiredFields ? (
              <div className={getClassName("kcContentWrapperClass")}>
                <div
                  className={clsx(
                    getClassName("kcLabelWrapperClass"),
                    "subtitle"
                  )}
                >
                  <span className="subtitle">
                    <span className="required">*</span>
                    {msg("requiredFields")}
                  </span>
                </div>
                {/* <div className="col-md-10">
                  <h1 id="kc-page-title">{headerNode}</h1>
                </div> */}
              </div>
            ) : (
              // <h1 id="kc-page-title">{headerNode}</h1>
              <span></span>
            )
          ) : displayRequiredFields ? (
            <div className={getClassName("kcContentWrapperClass")}>
              <div
                className={clsx(
                  getClassName("kcLabelWrapperClass"),
                  "subtitle"
                )}
              >
                <span className="subtitle">
                  <span className="required">*</span> {msg("requiredFields")}
                </span>
              </div>
              <div className="col-md-10">
                {showUsernameNode}
                <div
                  className={(getClassName("kcFormGroupClass"), "space-y-2")}
                >
                  <div id="kc-username">
                    <label id="kc-attempted-username">
                      {auth?.attemptedUsername}
                    </label>
                    <a id="reset-login" href={url.loginRestartFlowUrl}>
                      <div className="kc-login-tooltip">
                        <i className={getClassName("kcResetFlowIcon")}></i>
                        <span className="kc-tooltip-text">
                          {msg("restartLoginTooltip")}
                        </span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {showUsernameNode}
              <div className={getClassName("kcFormGroupClass")}>
                <div id="kc-username">
                  <label id="kc-attempted-username">
                    {auth?.attemptedUsername}
                  </label>
                  <a id="reset-login" href={url.loginRestartFlowUrl}>
                    <div className="kc-login-tooltip">
                      <i className={getClassName("kcResetFlowIcon")}></i>
                      <span className="kc-tooltip-text">
                        {msg("restartLoginTooltip")}
                      </span>
                    </div>
                  </a>
                </div>
              </div>
            </>
          )}
        </header>
        <div id="kc-content">
          <div id="kc-content-wrapper">
            {/* App-initiated actions should not see warning messages about the need to complete the action during login. */}
            {displayMessage &&
              message !== undefined &&
              (message.type !== "warning" || !isAppInitiatedAction) && (
                <div className={clsx("alert", `alert-${message.type}`)}>
                  {message.type === "success" && (
                    <span
                      className={getClassName("kcFeedbackSuccessIcon")}
                    ></span>
                  )}
                  {message.type === "warning" && (
                    <span
                      className={getClassName("kcFeedbackWarningIcon")}
                    ></span>
                  )}
                  {message.type === "error" && (
                    <span
                      className={getClassName("kcFeedbackErrorIcon")}
                    ></span>
                  )}
                  {message.type === "info" && (
                    <span className={getClassName("kcFeedbackInfoIcon")}></span>
                  )}
                  <span
                    className="kc-feedback-text"
                    dangerouslySetInnerHTML={{
                      __html: message.summary,
                    }}
                  />
                </div>
              )}
            {children}
            {auth !== undefined &&
              auth.showTryAnotherWayLink &&
              showAnotherWayIfPresent && (
                <form
                  id="kc-select-try-another-way-form"
                  action={url.loginAction}
                  method="post"
                  className={clsx(
                    displayWide && getClassName("kcContentWrapperClass")
                  )}
                >
                  <div
                    className={clsx(
                      displayWide && [
                        getClassName("kcFormSocialAccountContentClass"),
                        getClassName("kcFormSocialAccountClass"),
                      ]
                    )}
                  >
                    <div className={getClassName("kcFormGroupClass")}>
                      <input type="hidden" name="tryAnotherWay" value="on" />
                      <a
                        href="#"
                        id="try-another-way"
                        onClick={() => {
                          document.forms[
                            "kc-select-try-another-way-form" as never
                          ].submit();
                          return false;
                        }}
                      >
                        {msg("doTryAnotherWay")}
                      </a>
                    </div>
                  </div>
                </form>
              )}
            {displayInfo && (
              <div className={(getClassName("kcSignUpClass"), "pb-3")}>
                <div
                  id="kc-info-wrapper"
                  className={(getClassName("kcInfoAreaWrapperClass"), "mb-2")}
                >
                  {infoNode}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
