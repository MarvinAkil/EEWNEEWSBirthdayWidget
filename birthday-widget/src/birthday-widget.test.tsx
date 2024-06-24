import React from "react"
import {screen, render} from "@testing-library/react"

import {BirthdayWidget} from "./birthday-widget";

describe("BirthdayWidget", () => {
    it("should render the component", () => {
        render(<BirthdayWidget contentLanguage="en_US" message="World"/>);

        expect(screen.getByText(/Hello World/)).toBeInTheDocument();
    })
})
