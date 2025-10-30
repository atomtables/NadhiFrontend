# Nadhi: The Frontend

This section of the app is the part that users are meant to use. It's a single, lightweight
phone app that activates when necessary. Nadhi utilises existing technology, like the user's
phone, to be as useful as possible while also not being very intrusive. This way, Nadhi is
easy to use when flooding does hit.

The app works on a cycle of 4 different states: no flooding, where the dashboard remains pretty empty;
possible flooding, where the NWS has issued a warning that is not active yet; active flooding, where
flooding is currently happening and the NWS's warning is active at the moment; and past flooding,
where flooding has happened and the app goes into help mode.

Most of the components can be found in /app/components. Assets can be found in /assets.

To build this app, you need to compile a development build. Use `eas` or you can manually compile.

This app uses expo and react-native.

### P.S. Nadhi, translated from Tamil, means: "river". It's also the acronym