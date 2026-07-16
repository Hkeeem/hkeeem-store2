<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: sans-serif;
            background-color: #f3e5f5; /* بنفسجي فاتح */
            display: flex;
            justify-content: center;
            align-items: flex-start;
            height: 100vh;
            padding-top: 20px;
        }

        .container {
            width: 90%;
            max-width: 600px;
            background: white;
            padding: 20px;
            border-radius: 20px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            animation: fadeIn 1.5s ease-in-out;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
        }

        .ai-button {
            background: linear-gradient(90deg, #7b1fa2, #ab47bc);
            color: white;
            padding: 10px 20px;
            border-radius: 50px;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 5px;
            transition: transform 0.3s;
        }

        .ai-button:hover {
            transform: scale(1.05);
        }

        h2 {
            text-align: right;
            color: #333;
        }

        /* تأثير الحركة */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body>

<div class="container">
    <div class="header">
        <div>تسجيل دخول</div>
        <div class="ai-button">✨ AI المساعد الاقتصادي</div>
        <div>hkeeem</div>
    </div>
    
    <h2>قائمة العروض المتاحة</h2>
</div>

</body>
</html>
