'use client'

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const defaultAgentConfig = {
  name: "Standing Room GPT Agent",
  model: "gpt-4o",
  visual_mode_default: true,
  reasoning_modes: ["ToT", "CoT", "Schema", "Planner"],
  tools: [
    "code_interpreter",
    "file_search",
    "python",
    "web",
    "terminal (task-master)",
    "Google Drive",
    "Gmail Connector",
    "Webhook Runner",
    "Audiense Client",
    "Gradio UI",
    "Supabase",
    "Snowflake",
  ],
  core_features: [
    "multi-agent chaining",
    "tool-triggered logic",
    "visual render support",
    "task planning CLI",
    "reasoning mode toggles",
    "prompt variant evaluation"
  ],
  output_formats: ["csv", "timeline", "notion", "html"],
  prompt_styles: ["Instructional", "Creative", "Extractive", "Multimodal"]
};

export default function VisualModeConfigUI() {
  const [config, setConfig] = useState(defaultAgentConfig);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit() {
    setSaving(true);
    setMessage(null);
    
    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        setMessage('Agent configuration saved successfully!');
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage('Failed to save configuration');
      }
    } catch (error) {
      setMessage('Error saving configuration');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-4 grid gap-4 max-w-2xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">🧠 Visual Mode Agent Configurator</h2>
        <p className="text-gray-600">Configure your AI agent with advanced reasoning modes and tools</p>
      </div>

      {message && (
        <div className={`p-4 rounded-md ${
          message.includes('successfully') 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message}
        </div>
      )}

      <Card>
        <CardContent className="grid gap-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Agent Name</label>
              <Input
                name="name"
                value={config.name}
                onChange={handleChange}
                placeholder="Agent Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
              <Input
                name="model"
                value={config.model}
                onChange={handleChange}
                placeholder="GPT Model (e.g. gpt-4o)"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Core Features</label>
            <Textarea
              name="core_features"
              value={config.core_features.join(", ")}
              onChange={(e) => setConfig((prev) => ({ ...prev, core_features: e.target.value.split(", ").filter(Boolean) }))}
              placeholder="Core features (comma separated)"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Enabled Tools</label>
            <Textarea
              name="tools"
              value={config.tools.join(", ")}
              onChange={(e) => setConfig((prev) => ({ ...prev, tools: e.target.value.split(", ").filter(Boolean) }))}
              placeholder="Enabled tools (comma separated)"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reasoning Modes</label>
            <Textarea
              name="reasoning_modes"
              value={config.reasoning_modes.join(", ")}
              onChange={(e) => setConfig((prev) => ({ ...prev, reasoning_modes: e.target.value.split(", ").filter(Boolean) }))}
              placeholder="Reasoning modes (comma separated)"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Output Formats</label>
              <Textarea
                name="output_formats"
                value={config.output_formats.join(", ")}
                onChange={(e) => setConfig((prev) => ({ ...prev, output_formats: e.target.value.split(", ").filter(Boolean) }))}
                placeholder="Output formats (comma separated)"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prompt Styles</label>
              <Textarea
                name="prompt_styles"
                value={config.prompt_styles.join(", ")}
                onChange={(e) => setConfig((prev) => ({ ...prev, prompt_styles: e.target.value.split(", ").filter(Boolean) }))}
                placeholder="Prompt styles (comma separated)"
                rows={2}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="visual_mode_default"
              checked={config.visual_mode_default}
              onChange={(e) => setConfig((prev) => ({ ...prev, visual_mode_default: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="visual_mode_default" className="text-sm font-medium text-gray-700">
              Enable Visual Mode by Default
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setConfig(defaultAgentConfig)}
            >
              Reset to Default
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Agent Configuration'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Preview */}
      <Card>
        <CardContent className="mt-4">
          <h3 className="text-lg font-semibold mb-4">Configuration Preview</h3>
          <div className="bg-gray-50 p-4 rounded-md">
            <pre className="text-sm text-gray-700 overflow-auto">
              {JSON.stringify(config, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
