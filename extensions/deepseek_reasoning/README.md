# Deepseek Reasoning Display Extension

This extension enhances the Typing Mind interface when using Deepseek models through OpenRouter by displaying the model's reasoning process alongside its responses.



https://github.com/user-attachments/assets/8be6530b-b751-4117-8f59-bac3fcbce412







## Installation

Add this URL to your TypingMind extensions:
```
https://cdn.jsdelivr.net/gh/shaggy2626/typingmind-themes-extensions/extensions/deepseek_reasoning/deepseek_reasoning.js
```

## What it Does

When using any Deepseek model via OpenRouter, the models provide two types of content in their responses:
1. `reasoning`: The model's internal thought process (streamed in real-time)
2. `content`: The final response

By default, Typing Mind only shows the final response (`content`). This extension modifies the display to show:
- "💭 Thinking..." when the model starts reasoning
- The reasoning process in quote blocks (>)
- "💡 Thought for X seconds" when reasoning is complete
- A separator line (---)
- The final response

## Example

When you chat with a Deepseek model through OpenRouter, instead of seeing just:
```
Here's how to write a Python script...
```

You'll see:
```
💭 Thinking...
> First, let me understand what the user needs. They want help with Python scripting.
> I should provide clear steps and examples to guide them.
> Let me break this down into manageable parts.

💡 Thought for 3 seconds

---

Here's how to write a Python script...
```

## Features

- Works with streaming responses from OpenRouter
- Automatically detects and activates for any Deepseek model
- Maintains proper formatting with quote blocks
- Shows thinking duration in seconds
- Preserves paragraph structure
- Clean separation between reasoning and response

## Requirements

- Works with all Deepseek models on OpenRouter
- Requires Typing Mind's extension feature
- Works with both streaming and non-streaming responses
