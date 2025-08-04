package com.example.agriecommerce.service;

import com.example.agriecommerce.dto.request.AddressRequest;
import com.example.agriecommerce.dto.response.AddressResponse;
import com.example.agriecommerce.exception.ResourceNotFoundException;
import com.example.agriecommerce.model.Address;
import com.example.agriecommerce.model.User;
import com.example.agriecommerce.repository.AddressRepository;
import com.example.agriecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddressService {
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public List<AddressResponse> getUserAddresses(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        return addressRepository.findByUser(user).stream()
                .map(this::mapToAddressResponse)
                .collect(Collectors.toList());
    }

    public AddressResponse createAddress(Long userId, AddressRequest addressRequest) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Address address = new Address();
        address.setUser(user);
        address.setStreet(addressRequest.getStreet());
        address.setCity(addressRequest.getCity());
        address.setCounty(addressRequest.getCounty());
        address.setPostalCode(addressRequest.getPostalCode());
        address.setAdditionalInfo(addressRequest.getAdditionalInfo());
        address.setIsDefault(addressRequest.isDefault());

        // If this is set as default, unset any existing default address
        if (addressRequest.isDefault()) {
            addressRepository.findByUserAndIsDefault(user, true)
                    .ifPresent(addr -> {
                        addr.setIsDefault(false);
                        addressRepository.save(addr);
                    });
        }

        Address savedAddress = addressRepository.save(address);
        return mapToAddressResponse(savedAddress);
    }

    public AddressResponse updateAddress(Long userId, Long addressId, AddressRequest addressRequest) {
        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "id", addressId));

        address.setStreet(addressRequest.getStreet());
        address.setCity(addressRequest.getCity());
        address.setCounty(addressRequest.getCounty());
        address.setPostalCode(addressRequest.getPostalCode());
        address.setAdditionalInfo(addressRequest.getAdditionalInfo());

        // Handle default address change
        if (addressRequest.isDefault() && !address.getIsDefault()) {
            addressRepository.findByUserAndIsDefault(address.getUser(), true)
                    .ifPresent(addr -> {
                        addr.setIsDefault(false);
                        addressRepository.save(addr);
                    });
            address.setIsDefault(true);
        }

        Address updatedAddress = addressRepository.save(address);
        return mapToAddressResponse(updatedAddress);
    }

    public void deleteAddress(Long userId, Long addressId) {
        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "id", addressId));
        addressRepository.delete(address);
    }

    private AddressResponse mapToAddressResponse(Address address) {
        return AddressResponse.builder()
                .id(address.getId())
                .street(address.getStreet())
                .city(address.getCity())
                .county(address.getCounty())
                .postalCode(address.getPostalCode())
                .additionalInfo(address.getAdditionalInfo())
                .isDefault(address.getIsDefault())
                .build();
    }
}