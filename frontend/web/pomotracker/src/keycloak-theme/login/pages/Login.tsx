import { useState, type FormEventHandler } from "react";
import { clsx } from "keycloakify/tools/clsx";
import { useConstCallback } from "keycloakify/tools/useConstCallback";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { useGetClassName } from "keycloakify/login/lib/useGetClassName";
import type { KcContext } from "../kcContext";
import type { I18n } from "../i18n";
import { motion } from "framer-motion";

// import loginHeaderSvgUrl from "../assets/login-header.svg";

// import userLoginIconSvgUrl from "../assets/user-login-icon.svg";
// import Timer from "../../../components/timer/Timer";

const my_custom_param = new URL(window.location.href).searchParams.get(
  "my_custom_param"
);

if (my_custom_param !== null) {
  console.log("my_custom_param:", my_custom_param);
}

export default function Login(
  props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

  const { getClassName } = useGetClassName({
    doUseDefaultCss,
    classes,
  });

  const {
    social,
    realm,
    url,
    usernameHidden,
    login,
    auth,
    registrationDisabled,
  } = kcContext;

  const { msg, msgStr } = i18n;

  const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

  const onSubmit = useConstCallback<FormEventHandler<HTMLFormElement>>((e) => {
    e.preventDefault();

    setIsLoginButtonDisabled(true);

    const formElement = e.target as HTMLFormElement;

    //NOTE: Even if we login with email Keycloak expect username and password in
    //the POST request.
    formElement
      .querySelector("input[name='email']")
      ?.setAttribute("name", "username");

    formElement.submit();
  });

  return (
    <Template
      {...{ kcContext, i18n, doUseDefaultCss, classes }}
      displayInfo={
        realm.password && realm.registrationAllowed && !registrationDisabled
      }
      displayWide={true}
      headerNode={msg("doLogIn")}
      infoNode={
        <div
          id="kc-registration"
          className={"text-center mt-3, text-[#EEEEEE]"}
        >
          <span>
            {msg("noAccount")}{" "}
            <a tabIndex={6} href={url.registrationUrl}>
              {msg("doRegister")}
            </a>
          </span>
        </div>
      }
    >
      <motion.div
        id="kc-form"
        className={
          (clsx(
            realm.password &&
              social.providers !== undefined &&
              getClassName("kcContentWrapperClass")
          ),
          "flex justify-center items-center, justify-items-center")
        }
      >
        {/* <div className="flex-col justify-center items-center justify-items-center flex-1 mx-4 mt-20">
          <Timer size={400} strokeWidth={10} time={10} />
        </div> */}
        <div
          id="kc-form-wrapper"
          className={
            (clsx(
              realm.password &&
                social.providers && [
                  getClassName("kcFormSocialAccountContentClass"),
                  getClassName("kcFormSocialAccountClass"),
                ]
            ),
            "flex-col justify-center items-center flex-1 mx-4")
          }
        >
          <div className="flex flex-col justify-center items-center pb-[6vh] pt-10">
            <div className="flex flex-col items-center pb-3">
              <span className="text-6xl text-white font-bold ">
                Pomotracker
              </span>
              {/* <img src={loginHeaderSvgUrl} width="40px" /> */}
            </div>
          </div>

          {realm.password && (
            <form
              id="kc-form-login"
              onSubmit={onSubmit}
              action={url.loginAction}
              method="post"
              className={"flex flex-col justify-center items-center"}
            >
              <div className={getClassName("kcFormGroupClass")}>
                {!usernameHidden &&
                  (() => {
                    const label = !realm.loginWithEmailAllowed
                      ? "username"
                      : realm.registrationEmailAsUsername
                      ? "email"
                      : "usernameOrEmail";

                    const autoCompleteHelper: typeof label =
                      label === "usernameOrEmail" ? "username" : label;

                    return (
                      <>
                        <label
                          htmlFor={autoCompleteHelper}
                          className={
                            (getClassName("kcLabelClass"), "text-[#EEEEEE]")
                          }
                        >
                          {msg(label)}
                        </label>
                        <input
                          tabIndex={1}
                          id={autoCompleteHelper}
                          className={getClassName("kcInputClass")}
                          //NOTE: This is used by Google Chrome auto fill so we use it to tell
                          //the browser how to pre fill the form but before submit we put it back
                          //to username because it is what keycloak expects.
                          name={autoCompleteHelper}
                          defaultValue={login.username ?? ""}
                          type="text"
                          autoFocus={true}
                          autoComplete="off"
                        />
                        {/* <img src={userLoginIconSvgUrl} /> */}
                      </>
                    );
                  })()}
              </div>
              <div className={getClassName("kcFormGroupClass")}>
                <label
                  htmlFor="password"
                  className={(getClassName("kcLabelClass"), "text-white")}
                >
                  {msg("password")}
                </label>
                <input
                  tabIndex={2}
                  id="password"
                  className={getClassName("kcInputClass")}
                  name="password"
                  type="password"
                  autoComplete="off"
                />
              </div>
              <div
                className={clsx(
                  getClassName("kcFormGroupClass"),
                  getClassName("kcFormSettingClass")
                )}
              >
                <div id="kc-form-options">
                  {realm.rememberMe && !usernameHidden && (
                    <div className="checkbox">
                      <label className="text-[#EEEEEE]">
                        <input
                          tabIndex={3}
                          id="rememberMe"
                          name="rememberMe"
                          type="checkbox"
                          {...(login.rememberMe === "on"
                            ? {
                                checked: true,
                              }
                            : {})}
                        />
                        {msg("rememberMe")}
                      </label>
                    </div>
                  )}
                </div>
                <div
                  className={
                    (getClassName("kcFormOptionsWrapperClass"),
                    "text-[#EEEEEE]")
                  }
                >
                  {realm.resetPasswordAllowed && (
                    <span>
                      <a tabIndex={5} href={url.loginResetCredentialsUrl}>
                        {msg("doForgotPassword")}
                      </a>
                    </span>
                  )}
                </div>
              </div>
              <div className={getClassName("kcFormGroupClass")}>
                <input
                  type="hidden"
                  id="id-hidden-input"
                  name="credentialId"
                  {...(auth?.selectedCredential !== undefined
                    ? {
                        value: auth.selectedCredential,
                      }
                    : {})}
                />
                <input
                  tabIndex={4}
                  className={clsx(
                    getClassName("kcButtonBlockClass"),
                    getClassName("kcButtonLargeClass"),
                    "rounded-xl min-h-[7dvh] min-w-[10dvw] bg-[#76ABAE] hover:bg-[#76ABAE]-300 text-[#EEEEEE] mb-8"
                  )}
                  name="login"
                  id="kc-login"
                  type="submit"
                  value={msgStr("doLogIn")}
                  disabled={isLoginButtonDisabled}
                />
              </div>
            </form>
          )}
        </div>
        {realm.password && social.providers !== undefined && (
          <div
            id="kc-social-providers"
            className={clsx(
              getClassName("kcFormSocialAccountContentClass"),
              getClassName("kcFormSocialAccountClass")
            )}
          >
            <ul
              className={clsx(
                getClassName("kcFormSocialAccountListClass"),
                social.providers.length > 4 &&
                  getClassName("kcFormSocialAccountDoubleListClass")
              )}
            >
              {social.providers.map((p) => (
                <li
                  key={p.providerId}
                  className={getClassName("kcFormSocialAccountListLinkClass")}
                >
                  <a
                    href={p.loginUrl}
                    id={`zocial-${p.alias}`}
                    className={clsx("zocial", p.providerId)}
                  >
                    <span>{p.displayName}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </motion.div>
    </Template>
  );
}
