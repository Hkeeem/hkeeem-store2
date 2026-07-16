import 'package:flutter/material.dart';

class ProductCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 10)],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // صورة المنتج مع شارة "وفر"
          Stack(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
                child: Image.asset('assets/product.jpg', height: 120, width: double.infinity, fit: BoxFit.cover),
              ),
              Positioned(top: 8, left: 8, child: _buildDiscountBadge()),
            ],
          ),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Column(
              children: [
                Text("اسم المنتج هنا", style: TextStyle(fontWeight: FontWeight.bold)),
                Text("السعر: 1,449 ر.س", style: TextStyle(color: Colors.blue)),
                _buildCouponButton("EXTRA30"),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDiscountBadge() {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(color: Colors.amber, borderRadius: BorderRadius.circular(8)),
      child: Text("وفر 350 ر.س", style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
    );
  }

  Widget _buildCouponButton(String code) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(color: Colors.grey[200], borderRadius: BorderRadius.circular(20)),
      child: Text("كوبون: $code", style: TextStyle(fontSize: 12)),
    );
  }
}
