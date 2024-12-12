enum TokenType {
  Number,
  Variable,
  Operator,
  OpenParenthesis,
  ClosedParenthesis,
  Function,
}

type Token = {
  value: string;
  type: TokenType;
};

const Keywords: Record<string, TokenType> = {
  if: TokenType.Function,
};

const create_token = (value: string = "", type: TokenType): Token => {
  return { value, type };
};

const isAlpha = (value: string) => {
  return value.match(/[a-zA-Z]/);
};

const isDigit = (value: string) => {
  return value.match(/\d/);
};

const isWhitespace = (value: string) => {
  return value == " " || value == "\n" || value == "\t" || value == "\r";
};

export const tokenize = (input: string): Token[] => {
  const tokens: Token[] = [];
  const chars = input.split("");

  while (chars.length > 0) {
    if (
      chars[0] == "+" ||
      chars[0] == "-" ||
      chars[0] == "*" ||
      chars[0] == "/"
    ) {
      tokens.push(create_token(chars.shift(), TokenType.Operator));
    } else if (chars[0] == "(") {
      tokens.push(create_token(chars.shift(), TokenType.OpenParenthesis));
    } else if (chars[0] == ")") {
      tokens.push(create_token(chars.shift(), TokenType.ClosedParenthesis));
    } else {
      if (isDigit(chars[0])) {
        let number = "";
        while (chars.length > 0 && (isDigit(chars[0]) || chars[0] == ".")) {
          number += chars.shift();
        }
        tokens.push(create_token(number, TokenType.Number));
      } else if (isAlpha(chars[0])) {
        let variable = "";

        while (chars.length > 0 && isAlpha(chars[0])) {
          variable += chars.shift();
        }

        const keyword = Keywords[variable];

        if (keyword == undefined) {
          tokens.push(create_token(variable, TokenType.Variable));
        } else {
          tokens.push(create_token(variable, keyword));
        }
      } else if (isWhitespace(chars[0])) {
        chars.shift();
      } else {
        console.log("Token not identified");
        Deno.exit(1);
      }
    }
  }

  return tokens;
};

const input = await Deno.readTextFile("test_input.txt");

for (const token of tokenize(input)) {
  console.log(token);
}
