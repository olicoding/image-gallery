// import { cleanEnv, str } from "envalid";

// const env = cleanEnv(process.env, {
//   API_KEY: str(),
//   NODE_ENV: str({ choices: ["development", "test", "production", "staging"] }),
// });

// export default env;

/**
Validator types

Node's process.env only stores strings, but sometimes you want to retrieve other types (booleans, numbers), or validate that an env var is in a specific format (JSON, URL, email address). To these ends, the following validation functions are available:

str() - Passes string values through, will ensure a value is present unless a default value is given. Note that an empty string is considered a valid value - if this is undesirable you can easily create your own validator (see below)
bool() - Parses env var strings "1", "0", "true", "false", "t", "f" into booleans
num() - Parses an env var (eg. "42", "0.23", "1e5") into a Number
email() - Ensures an env var is an email address
host() - Ensures an env var is either a domain name or an ip address (v4 or v6)
port() - Ensures an env var is a TCP port (1-65535)
url() - Ensures an env var is a URL with a protocol and hostname
json() - Parses an env var with JSON.parse


Each validation function accepts an (optional) object with the following attributes:

choices - An Array that lists the admissible parsed values for the env var.
default - A fallback value, which will be present in the output if the env var wasn't specified. Providing a default effectively makes the env var optional. Note that default values are not passed through validation logic, they are default output values.
devDefault - A fallback value to use only when NODE_ENV is explicitly set and not 'production'. This is handy for env vars that are required for production environments, but optional for development and testing.
desc - A string that describes the env var.
example - An example value for the env var.
docs - A URL that leads to more detailed documentation about the env var.
 */
