# Code Animation MVP

This project allows you to create code animation videos using Code Hike and Remotion.

## Features

- **Split Screen Editor:** Write Markdown on the left, see the video preview on the right.
- **Code Animation:** Uses Code Hike to animate code changes (token transitions).
- **Export:** Export the animation to an MP4 file.

## Getting Started

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Start the development server:
    ```bash
    npm run dev
    ```

3.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use

1.  Edit the Markdown in the left panel.
2.  Use the `!!steps [Title]` syntax to define steps.
3.  Include a code block in each step.
    
    Example:
    ```markdown
    !!steps My First Step
    Some description...
    ```js
    console.log(1)
    ```
    
    !!steps My Second Step
    ```js
    console.log(2)
    ```
    ```

4.  The preview updates automatically.
5.  Click "Export MP4" to render the video.

## Troubleshooting

- Ensure you use `!!steps` for each new state of the code.
- Ensure you have a valid code block in each step.
