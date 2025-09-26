<?php

namespace App\Http\Controllers;

use App\Models\Partner;
use App\Http\Requests\StorePartnerRequest;
use App\Http\Requests\UpdatePartnerRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class PartnerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Partner::query();

        // Filter by active status
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        // Search by name or description
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Order by display_order, then by name
        $query->orderBy('display_order')
              ->orderBy('name');

        $partners = $query->paginate($request->get('per_page', 15));

        return response()->json($partners);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePartnerRequest $request): JsonResponse
    {
        $data = $request->validated();

        // Handle logo upload - only if it's actually a file
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('partners', 'public');
            $data['logo_path'] = $logoPath;
        } elseif ($request->has('logo') && $request->logo === null) {
            // If logo is explicitly set to null, remove existing logo
            $data['logo_path'] = null;
        }
        // If logo field exists but is not a file, ignore it (don't set logo_path)

        $partner = Partner::create($data);

        return response()->json($partner, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Partner $partner): JsonResponse
    {
        return response()->json($partner);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePartnerRequest $request, Partner $partner): JsonResponse
    {
        $data = $request->validated();

        // Handle logo upload - only if it's actually a file
        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            if ($partner->logo_path) {
                Storage::disk('public')->delete($partner->logo_path);
            }

            $logoPath = $request->file('logo')->store('partners', 'public');
            $data['logo_path'] = $logoPath;
        } elseif ($request->has('logo') && $request->logo === null) {
            // If logo is explicitly set to null, remove existing logo
            if ($partner->logo_path) {
                Storage::disk('public')->delete($partner->logo_path);
            }
            $data['logo_path'] = null;
        }
        // If logo field exists but is not a file, ignore it (don't set logo_path)

        $partner->update($data);

        return response()->json($partner);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Partner $partner): JsonResponse
    {
        // Delete logo file if exists
        if ($partner->logo_path) {
            Storage::disk('public')->delete($partner->logo_path);
        }

        $partner->delete();

        return response()->json(null, 204);
    }

    /**
     * Toggle active status of the partner.
     */
    public function toggleActive(Partner $partner): JsonResponse
    {
        $partner->update(['is_active' => !$partner->is_active]);

        return response()->json($partner);
    }

    /**
     * Update display order of partners.
     */
    public function updateOrder(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'partners' => 'required|array',
            'partners.*.id' => 'required|exists:partners,id',
            'partners.*.display_order' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        foreach ($request->partners as $partnerData) {
            Partner::where('id', $partnerData['id'])
                  ->update(['display_order' => $partnerData['display_order']]);
        }

        return response()->json(['message' => 'Order updated successfully']);
    }
}
