import type {Dispatch, ReactNode, SetStateAction} from "react";
import {createContext, useContext, useState}      from "react";

enum Theme {
    DARK = 'dark', LIGHT = 'light'
}

type ThemeContextType = [Theme | null, Dispatch<SetStateAction<Theme | null>>];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const prefersDarkMQ = `(prefers-color-scheme: dark)`;

const getPreferredTheme = () => (window.matchMedia(prefersDarkMQ).matches
                                 ? Theme.DARK
                                 : Theme.LIGHT);

const ThemeProvider = ({children}: { children: ReactNode }) =>
    {
        const [theme, setTheme] = useState<Theme | null>(() =>
        {
            if(typeof window !== 'object')
                {
                    return null;
                }
            return getPreferredTheme();
        });

        return <ThemeContext.Provider value={[
            theme,
            setTheme,
        ]}>{children}</ThemeContext.Provider>;
    };

const useTheme = () =>
    {
        const context = useContext(ThemeContext);

        if(context === undefined)
            {
                throw new Error('useTheme must be used within a ThemeProvider. Ya noob.');
            }
        return context;
    };

const clientThemeCode = `
;(() => {
const theme = window.matchMedia(${JSON.stringify(prefersDarkMQ)}).matches ? '${Theme.DARK}' : '${Theme.LIGHT}';
const cl = document.documentElement.classList;
const themeAlreadyApplied = cl.contains('${Theme.DARK}') || cl.contains('${Theme.LIGHT}');
if(!themeAlreadyApplied){
    cl.add(theme);
}
})()`;
const EnsureThemeApplied = () =>
    {
        return <script dangerouslySetInnerHTML={{__html: clientThemeCode}}/>;
    };
export {EnsureThemeApplied, Theme, ThemeProvider, useTheme};
