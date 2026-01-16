import React, { useState } from "react";
import {
  Form,
  Input,
  DatePicker,
  TimePicker,
  Select,
  Button,
  Card,
  Typography,
  Alert,
  Divider,
  message,
  ConfigProvider,
  theme,
} from "antd";
import { ExperimentOutlined, StarFilled, MoonFilled } from "@ant-design/icons";
import dayjs from "dayjs";
import axios from "axios";

// Markdown Imports
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

// Import Styles
import "./App.css";

// Import the Chart Component
import NatalChart from "./NatalChart";

const { Title, Text } = Typography;
const { Option } = Select;

// --- Types ---
interface FormValues {
  name: string;
  gender: string;
  dob: dayjs.Dayjs;
  tob: dayjs.Dayjs;
}

interface ApiResponse {
  result: string;
}

interface ChartData {
  dob: dayjs.Dayjs;
  tob: dayjs.Dayjs;
}

// --- Component ---
const AstrologyReader: React.FC = () => {
  const [form] = Form.useForm();

  // State
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);

  const handleFinish = async (values: FormValues) => {
    setLoading(true);
    setResult(null);
    setError(null);
    setChartData(null);

    try {
      const formattedDate = values.dob.format("MMMM D, YYYY");
      const formattedTime = values.tob.format("h:mm A");

      // 1. Trigger the Chart Visualization immediately
      setChartData({ dob: values.dob, tob: values.tob });

      // 2. Construct Prompt
      const prompt = `
        Act as a warm, intuitive, and mystical Astrologer. 
        Reveal the celestial secrets for:
        - Name: ${values.name}
        - Gender: ${values.gender}
        - Born: ${formattedDate} at ${formattedTime}
        
        Please format your response using **Markdown**:
        1. **Celestial Trinity**: Identify Sun, Moon, and Ascendant signs with a brief, poetic description of the combination.
        2. **Soul Signature**: A summary of their personality and inner light.
        3. **Destiny & Heart**: A forecast for career paths and romantic connections.
        
        Tone: Empowering, mysterious, and kind. Use bullet points and bold text for readability.
      `.trim();

      // 3. Call API
      const response = await axios.post<ApiResponse>(
        "https://groqprompt.netlify.app/api/ai",
        { prompt: prompt },
        { headers: { "Content-Type": "application/json" } }
      );

      // 4. Handle Response
      if (response.data && response.data.result) {
        setResult(response.data.result);
        message.success({
          content: "The cosmos has revealed its secrets!",
          icon: <StarFilled style={{ color: "#ffd700" }} />,
        });
      } else {
        throw new Error("Invalid response");
      }
    } catch (err: any) {
      console.error(err);
      setError(
        "The connection to the stars is cloudy (API Error). Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: "#b23eff", // Mystical Purple
          fontFamily: "'Quicksand', sans-serif",
          borderRadius: 8,
          colorBgContainer: "rgba(0, 0, 0, 0.2)", // Semi-transparent inputs
        },
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          padding: "20px",
          // Background handled by global CSS (body)
        }}
      >
        <Card
          className="mystic-card"
          bordered={false}
          style={{ width: "100%", maxWidth: 700 }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <MoonFilled
              style={{
                fontSize: "40px",
                color: "#ffd700",
                marginBottom: "10px",
              }}
            />
            <Title level={2} className="mystic-title" style={{ margin: 0 }}>
              Celestial Guide
            </Title>
            <Text style={{ color: "#bfa5d6", fontSize: "16px" }}>
              Unlock the secrets of your birth chart
            </Text>
          </div>

          {/* Form */}
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            initialValues={{ gender: "Female" }}
            requiredMark={false}
          >
            <Form.Item
              label={<span className="mystic-label">Your Name</span>}
              name="name"
              rules={[{ required: true, message: "Please tell us your name" }]}
            >
              <Input
                placeholder="e.g. Luna Stargazer"
                size="large"
                allowClear
              />
            </Form.Item>

            <Form.Item
              label={<span className="mystic-label">Gender Identity</span>}
              name="gender"
              rules={[{ required: true }]}
            >
              <Select size="large">
                <Option value="Female">Female</Option>
                <Option value="Male">Male</Option>
                <Option value="Non-Binary">Non-Binary</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>

            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <Form.Item
                label={<span className="mystic-label">Date of Birth</span>}
                name="dob"
                style={{ flex: 1, minWidth: "140px" }}
                rules={[{ required: true, message: "Required for Sun Sign" }]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  size="large"
                  format="YYYY-MM-DD"
                  placeholder="Select Date"
                />
              </Form.Item>
              <Form.Item
                label={<span className="mystic-label">Time of Birth</span>}
                name="tob"
                style={{ flex: 1, minWidth: "140px" }}
                rules={[
                  { required: true, message: "Required for Ascendant Sign" },
                ]}
              >
                <TimePicker
                  style={{ width: "100%" }}
                  size="large"
                  format="HH:mm"
                  placeholder="Select Time"
                />
              </Form.Item>
            </div>

            <Divider style={{ borderColor: "rgba(255,255,255,0.1)" }} />

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
                className="cosmic-btn"
                icon={<ExperimentOutlined />}
                style={{ height: "50px", fontSize: "18px" }}
              >
                {loading ? "Consulting the Stars..." : "Reveal My Destiny"}
              </Button>
            </Form.Item>
          </Form>

          {/* Error Message */}
          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              closable
              style={{
                marginTop: "20px",
                background: "rgba(255,0,0,0.1)",
                border: "1px solid #ff4d4f",
              }}
            />
          )}

          {/* Results Area */}
          {(result || chartData) && (
            <div style={{ marginTop: "30px", animation: "fadeIn 1s ease-in" }}>
              <Divider
                dashed
                style={{ borderColor: "#ffd700", color: "#ffd700" }}
              >
                <StarFilled /> Your Reading <StarFilled />
              </Divider>

              {/* 1. Render the Natal Chart Graphic */}
              {chartData && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "20px",
                  }}
                >
                  <NatalChart dob={chartData.dob} tob={chartData.tob} />
                </div>
              )}

              {/* 2. Render the AI Markdown Analysis */}
              {result && (
                <div className="mystic-result-container">
                  <div className="mystic-markdown">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw]}
                      components={{
                        // Custom Blockquote Styling
                        blockquote: ({ node, ...props }) => (
                          <blockquote
                            className="mystic-blockquote"
                            {...props}
                          />
                        ),
                        // Links styling
                        a: ({ node, ...props }) => (
                          <a
                            style={{
                              color: "#ffd700",
                              textDecoration: "underline",
                            }}
                            {...props}
                          >
                            {props.children}
                          </a>
                        ),
                      }}
                    >
                      {result}
                    </ReactMarkdown>
                  </div>
                </div>
              )}

              <div
                style={{ textAlign: "center", marginTop: "20px", opacity: 0.7 }}
              >
                <Text style={{ fontSize: "12px", color: "#bfa5d6" }}>
                  * Readings are generated by AI for entertainment and guidance.
                </Text>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </ConfigProvider>
  );
};

export default AstrologyReader;
