import React, { useState } from "react";
import {
  Button,
  Input,
  Textarea,
  Select,
  Checkbox,
  Radio,
  ThemeToggle,
  Container,
  Switch,
  Alert,
  Badge,
  Progress,
} from "@/components";

const IndexPage = () => {
  const [switchState, setSwitchState] = useState(false);
  const [selectedRadio, setSelectedRadio] = useState("1");
  const [selectedValue, setSelectedValue] = useState("1");
  const [disabledSelectedValue, setDisabledSelectedValue] = useState("1");

  return (
    <>
      <ThemeToggle />
      <Container maxWidth="xl" className="py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          React UI Toolkit Components
        </h1>

        {/* Buttons Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Buttons</h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" size="sm">
                Small
              </Button>
              <Button variant="primary" size="md">
                Medium
              </Button>
              <Button variant="primary" size="lg">
                Large
              </Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" loading>
                Loading
              </Button>
              <Button variant="primary" disabled>
                Disabled
              </Button>
            </div>
          </div>
        </section>

        {/* Form Controls Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Form Controls
          </h2>

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Input label="Default Input" placeholder="Enter text..." />
            <Input label="Filled Input" variant="filled" placeholder="Filled variant..." />
            <Input
              label="Error Input"
              error={true}
              errorMessage="This field is required"
              placeholder="Error state..."
            />
            <Input label="Disabled Input" disabled placeholder="Disabled state..." />
          </div>

          {/* Textarea */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Textarea label="Default Textarea" placeholder="Enter long text..." />
            <Textarea
              label="With Error"
              error="This field is required"
              placeholder="Error state..."
            />
          </div>

          {/* Select */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Select
              label="Default Select"
              value={selectedValue}
              onChange={e => setSelectedValue(e.target.value)}
              options={[
                { value: "1", label: "Option 1" },
                { value: "2", label: "Option 2" },
                { value: "3", label: "Option 3" },
              ]}
            />
            <Select
              label="Disabled Select"
              value={disabledSelectedValue}
              onChange={e => setDisabledSelectedValue(e.target.value)}
              disabled
              options={[
                { value: "1", label: "Option 1" },
                { value: "2", label: "Option 2" },
              ]}
            />
          </div>

          {/* Checkboxes */}
          <div className="space-y-4 mb-8">
            <Checkbox label="Default Checkbox" />
            <Checkbox label="Checked Checkbox" checked />
            <Checkbox label="Disabled Checkbox" disabled />
            <Checkbox label="Error Checkbox" error errorMessage="This field is required" />
          </div>

          {/* Radio Buttons */}
          <div className="space-y-4 mb-8">
            <Radio
              name="radio-group"
              value="1"
              label="Option 1"
              checked={selectedRadio === "1"}
              onChange={e => setSelectedRadio(e.target.value)}
            />
            <Radio
              name="radio-group"
              value="2"
              label="Option 2"
              checked={selectedRadio === "2"}
              onChange={e => setSelectedRadio(e.target.value)}
            />
            <Radio name="radio-group" value="3" label="Disabled Option" disabled />
          </div>

          {/* Switches */}
          <div className="space-y-4">
            <Switch
              label="Default Switch"
              checked={switchState}
              onChange={() => setSwitchState(!switchState)}
            />
            <Switch label="Disabled Switch" disabled />
            <Switch label="Error Switch" error="This field has an error" />
          </div>
        </section>

        {/* Feedback Components Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Feedback Components
          </h2>

          {/* Alerts */}
          <div className="space-y-4 mb-8">
            <Alert variant="info" title="Information">
              This is an info alert
            </Alert>
            <Alert variant="success" title="Success">
              This is a success alert
            </Alert>
            <Alert variant="warning" title="Warning">
              This is a warning alert
            </Alert>
            <Alert variant="error" title="Error">
              This is an error alert
            </Alert>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Badge variant="primary">Primary</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
          </div>

          {/* Progress */}
          <div className="space-y-6">
            <Progress value={30} max={100} />
            <Progress value={60} max={100} variant="primary" showValue />
            <Progress value={80} max={100} variant="success" showValue striped />
            <Progress value={45} max={100} variant="warning" showValue striped animated />
          </div>
        </section>
      </Container>
    </>
  );
};

export default IndexPage;
