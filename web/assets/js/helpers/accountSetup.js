// Account registration process.
async function accountSetup() {
  try {
    let username = inputCreateUsername.value;

    if (
      empty(username) ||
      empty(inputCreatePassword.value) ||
      empty(inputCreateRepeatPassword.value)
    ) {
      errorNotification("Please fill out all fields.");
      return;
    }

    if (!validUsername(username)) {
      errorNotification(
        "Username must be shorter than 16 characters, and not contain any special characters."
      );
      return;
    }

    let exists = await userExists(username);

    if (
      exists.data.userExists ===
      "User registration has been disabled by the admin."
    ) {
      errorNotification("User registration has been disabled by the admin.");
      return;
    }

    if (exists.data.userExists !== "Not found.") {
      errorNotification("A user with that username already exists.");
      return;
    }

    if (inputCreatePassword.value !== inputCreateRepeatPassword.value) {
      errorNotification("Passwords don't match.");
      return;
    }

    let popup = new Popup(
      300,
      "auto",
      "Account Creation",
      `<span>Would you like to create your new account, ${username}?</span>`
    );
    popup.show();

    DOMCache.innerHTML = `<div id="cache-content"><img class="hidden" src="./assets/img/BG-White.png" alt="White Background"><img class="hidden" src="./assets/img/BG-Black.png" alt="Black Background"></div>`;

    let count = 0;

    popup.on("confirm", () => {
      switch (count) {
        case 0:
          popup.setOptions({ confirmText: "Continue" });
          popup.setHTML(
            `<span>Before your account can be created, you'll need to complete a short setup process.</span>`
          );
          count++;
          break;
        case 1:
          popup.setSize(700, "auto");
          popup.setOptions({ cancelText: "Disagree", confirmText: "Agree" });
          popup.setHTML(`<span><h2>Crypto Share Automation Disclaimer</h2>

						<p>By using <strong>Crypto Share Automation</strong>, you agree to the following:</p>
				
						<ul>
								<li><strong>Third-Party Data:</strong> Prices and details come from external sources and may be inaccurate.</li>
								<li><strong>Trading Risks:</strong> Crypto trading is high-risk—you may lose all your money.</li>
								<li><strong>No Trading Services:</strong> Crypto Automation does not provide trading services or access your financial accounts.</li>
								<li><strong>Software Integrity:</strong> Bugs may exist. The developer is not responsible for data loss or issues.</li>
								<li><strong>Data Storage:</strong> Your data is stored on your device and never shared with third parties.</li>
								<li><strong>Legal Limitations:</strong> Tax and mortgage data are based on <strong>Indian law</strong> and may not apply elsewhere.</li>
						</ul></span><span class="detail">Developer Contact: @Group 4(GHRCE)</span>`);

          count++;

          break;
        case 2:
          popup.setSize(460, 695);
          popup.setOptions({ cancelText: "Cancel", confirmText: "Continue" });
          popup.setHTML(
            `<span>Which color theme would you like to use?</span><img class="clickable" id="popup-clickable-light" src="./assets/img/BG-White.png" alt="Light Theme"><img class="clickable" id="popup-clickable-dark" src="./assets/img/BG-Black.png" alt="Dark Theme">`
          );

          DOMCache.innerHTML = "";

          let images = popup.element.getElementsByTagName("img");
          for (let i = 0; i < images.length; i++) {
            if (images[i].id.includes(applicationSettings.theme)) {
              images[i].classList.add("active");
            }

            images[i].addEventListener("click", async () => {
              for (let j = 0; j < images.length; j++) {
                images[j].classList.remove("active");
              }

              if (images[i].id === "popup-clickable-light") {
                await setTheme("light");
              } else {
                await setTheme("dark");
              }

              images[i].classList.add("active");
            });
          }

          count++;

          break;
        case 3:
          popup.setOptions({ confirmText: "Finish" });
          popup.setHTML(
            `<span>If you aren't hosting Crypto Share yourself, please be aware that whoever is hosting it can modify the code to steal your financial data, so make sure you trust them.</span>`
          );
          popup.setSize(460, "auto");
          popup.updateHeight();
          count++;
          break;
        case 4:
          let key = CryptoFN.generateAESKey();
          let encrypted = CryptoFN.encryptAES(key, inputCreatePassword.value);

          createAccount(username, inputCreatePassword.value, encrypted)
            .then(async (result) => {
              if (result.data.createUser === "Done") {
                await appStorage.setItem("key", key);
                await appStorage.setItem("firstLogin", "true");

                popup.hide();

                buttonExistingAccount.click();

                inputLoginUsername.value = username;
                inputLoginPassword.value = inputCreatePassword.value;

                buttonLoginAccount.click();

                successNotification(
                  "Account Created",
                  "You will now be logged in..."
                );
              } else {
                errorNotification(result.data.createUser);
              }
            })
            .catch((error) => {
              errorNotification(error);
              console.log(error);
            });
          break;
      }
    });
  } catch (error) {
    errorNotification(error);
  }
}
