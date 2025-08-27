# 🎨 Figma Integration Setup

## 🔑 **Get Your Figma Access Token**

1. **Go to Figma Settings**
   - Open Figma and go to your account settings
   - Navigate to "Personal access tokens"
   - Click "Create new token"

2. **Create Token**
   - Give it a name like "Precisely The Same Integration"
   - Copy the generated token

3. **Update Environment**
   ```bash
   # Edit .env.local and replace the placeholder
   FIGMA_ACCESS_TOKEN=your_actual_figma_token_here
   ```

## 📁 **Connect Your Design Files**

### **Find Your File Key**
- Open your Figma design file
- The URL will look like: `https://www.figma.com/file/ABC123/Design-Name`
- The file key is `ABC123`

### **Get Node IDs (Optional)**
- Select specific elements in your design
- Right-click → "Copy/Paste as" → "Copy link"
- The link contains the node ID

## 🚀 **Usage Examples**

### **Display Your Daily Dairy Design**
```tsx
<FigmaDesign 
  fileKey="your_figma_file_key_here"
  title="DAILY DAIRY"
  description="MY COLLECTION — A MILK CAP A DAY, EVERY DAY"
/>
```

### **Fetch Specific Design Elements**
```tsx
// In your component
const fetchDesign = async () => {
  const response = await fetch('/api/figma?fileKey=ABC123&nodeIds=node1,node2')
  const data = await response.json()
  // Use the design data
}
```

## 🌐 **API Endpoints**

### **GET /api/figma**
- **Query Parameters:**
  - `fileKey` (required): Your Figma file key
  - `nodeIds` (optional): Comma-separated node IDs

### **POST /api/figma**
- **Body:**
  ```json
  {
    "fileKey": "your_file_key",
    "nodeIds": ["node1", "node2"],
    "format": "png"
  }
  ```

## 🎯 **Perfect for Your Daily Dairy Collection**

Your Figma integration is now ready to:
- ✅ **Display designs** from your Figma files
- ✅ **Auto-update** when designs change
- ✅ **Export images** for your collection
- ✅ **Maintain consistency** between design and code
- ✅ **Collaborate** with designers in real-time

## 🔧 **Customization Options**

- **Design Themes**: Change colors, fonts, layouts
- **Collection Items**: Add new milk cap designs
- **Responsive Design**: Optimize for all devices
- **Animation**: Add smooth transitions
- **CMS Integration**: Manage content through Supabase

## 📱 **Next Steps**

1. **Get your Figma access token**
2. **Update .env.local with the token**
3. **Add your design file key to the FigmaDesign component**
4. **Test the integration with `npm run dev`**
5. **Deploy to see it live on www.preciselythesame.com**

---

**Your daily dairy collection is now connected to Figma! 🥛✨**
