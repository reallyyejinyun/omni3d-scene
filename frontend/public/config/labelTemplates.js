export default [
  {
    "id": "glass-card",
    "name": "磨砂科技卡片",
    "html": "<div class=\"glass-label\">\n  <div class=\"label-title\">{{title}}</div>\n  <div class=\"label-value\">{{value}}</div>\n  <div class=\"label-unit\">{{unit}}</div>\n</div>",
    "css": `.glass-label {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 8px 12px;
  color: white;
  min-width: 100px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  pointer-events: auto;
}

.label-title {
  font-size: 10px;
  opacity: 0.6;
  margin-bottom: 2px;
}

.label-value {
  font-size: 18px;
  font-weight: bold;
  color: #4facfe;
  display: inline-block;
}

.label-unit {
  font-size: 10px;
  opacity: 0.8;
  display: inline-block;
  margin-left: 4px;
}
    `,

    "fields": [
      "title",
      "value",
      "unit"
    ]
  },
  {
    "id": "alert-tag",
    "name": "状态告警面板",
    "html": "<div class=\"alert-label status-{{status}}\">\n  <div class=\"dot\"></div>\n  <div class=\"content\">\n    <div class=\"name\">{{name}}</div>\n    <div class=\"msg\">{{status}}</div>\n  </div>\n</div>",
    "css": `.alert-label {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: #222;
  border-left: 4px solid #4facfe;
  border-radius: 4px;
  color: white;
  pointer-events: auto;
}

.alert-label.status-Online {
  border-left-color: #10b981;
}

.alert-label.status-Warning {
  border-left-color: #f59e0b;
}

.alert-label.status-Error {
  border-left-color: #ef4444;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

.name {
  font-size: 10px;
  font-weight: bold;
}

.msg {
  font-size: 9px;
  opacity: 0.7;
}`,
    "fields": [
      "name",
      "status"
    ]
  }
]
