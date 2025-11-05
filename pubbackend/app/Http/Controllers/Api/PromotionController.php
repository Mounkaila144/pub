<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Promotion;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PromotionController extends Controller
{
    /**
     * Get all promotions for a book.
     */
    public function index(Book $book): JsonResponse
    {
        $promotions = $book->promotions()->get();

        return response()->json([
            'success' => true,
            'data' => $promotions,
        ]);
    }

    /**
     * Get only valid promotions for a book (public).
     */
    public function valid(Book $book): JsonResponse
    {
        $promotions = $book->validPromotions()->get();

        return response()->json([
            'success' => true,
            'data' => $promotions,
        ]);
    }

    /**
     * Store a new promotion.
     */
    public function store(Request $request, Book $book): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:percentage,fixed,buy_x_get_y,tiered',
            'discount_percentage' => 'required_if:type,percentage|nullable|numeric|min:0|max:100',
            'discount_amount_cfa' => 'required_if:type,fixed|nullable|integer|min:0',
            'buy_quantity' => 'required_if:type,buy_x_get_y|nullable|integer|min:1',
            'get_quantity' => 'required_if:type,buy_x_get_y|nullable|integer|min:1',
            'tiers' => 'required_if:type,tiered|nullable|array',
            'tiers.*.min' => 'required|integer|min:1',
            'tiers.*.max' => 'nullable|integer',
            'tiers.*.discount' => 'required|numeric|min:0|max:100',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
            'min_purchase_quantity' => 'nullable|integer|min:1',
            'max_uses' => 'nullable|integer|min:1',
            'is_active' => 'boolean',
            'display_order' => 'nullable|integer',
        ]);

        $validated['book_id'] = $book->id;
        $validated['uses_count'] = 0;

        $promotion = Promotion::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Promotion créée avec succès',
            'data' => $promotion,
        ], 201);
    }

    /**
     * Update a promotion.
     */
    public function update(Request $request, Book $book, Promotion $promotion): JsonResponse
    {
        // Verify the promotion belongs to the book
        if ($promotion->book_id !== $book->id) {
            return response()->json([
                'success' => false,
                'message' => 'Promotion non trouvée pour ce livre',
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'type' => 'sometimes|in:percentage,fixed,buy_x_get_y,tiered',
            'discount_percentage' => 'nullable|numeric|min:0|max:100',
            'discount_amount_cfa' => 'nullable|integer|min:0',
            'buy_quantity' => 'nullable|integer|min:1',
            'get_quantity' => 'nullable|integer|min:1',
            'tiers' => 'nullable|array',
            'tiers.*.min' => 'required|integer|min:1',
            'tiers.*.max' => 'nullable|integer',
            'tiers.*.discount' => 'required|numeric|min:0|max:100',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'min_purchase_quantity' => 'nullable|integer|min:1',
            'max_uses' => 'nullable|integer|min:1',
            'is_active' => 'boolean',
            'display_order' => 'nullable|integer',
        ]);

        $promotion->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Promotion mise à jour avec succès',
            'data' => $promotion->fresh(),
        ]);
    }

    /**
     * Delete a promotion.
     */
    public function destroy(Book $book, Promotion $promotion): JsonResponse
    {
        // Verify the promotion belongs to the book
        if ($promotion->book_id !== $book->id) {
            return response()->json([
                'success' => false,
                'message' => 'Promotion non trouvée pour ce livre',
            ], 404);
        }

        $promotion->delete();

        return response()->json([
            'success' => true,
            'message' => 'Promotion supprimée avec succès',
        ]);
    }

    /**
     * Calculate discount for a given quantity.
     */
    public function calculate(Request $request, Book $book, Promotion $promotion): JsonResponse
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
            'unit_price' => 'required|integer|min:0',
        ]);

        $result = $promotion->calculateDiscount(
            $validated['quantity'],
            $validated['unit_price']
        );

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }
}
