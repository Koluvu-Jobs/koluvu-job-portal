from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import TrainingProviderProfile, TrainingProgram, TrainingEnrollment, Internship, Placement
from .serializers import (
    TrainingProviderProfileSerializer, TrainingProviderRegistrationSerializer,
    TrainingProgramSerializer, TrainingEnrollmentSerializer, InternshipSerializer, PlacementSerializer
)


class RegisterTrainingProviderView(generics.CreateAPIView):
    """Register a new training provider"""
    queryset = User.objects.all()
    serializer_class = TrainingProviderRegistrationSerializer
    permission_classes = []  # Allow unauthenticated access for registration


class TrainingProviderProfileView(generics.RetrieveUpdateAPIView):
    """Get and update training provider profile"""
    serializer_class = TrainingProviderProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        profile, created = TrainingProviderProfile.objects.get_or_create(user=self.request.user)
        return profile


class TrainingProviderLoginView(generics.GenericAPIView):
    """Training provider login view"""
    permission_classes = []
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if user:
                profile, created = TrainingProviderProfile.objects.get_or_create(user=user)
                serializer = TrainingProviderProfileSerializer(profile)
                return Response({
                    'message': 'Login successful',
                    'user': serializer.data
                })
            else:
                return Response({
                    'error': 'Invalid credentials'
                }, status=status.HTTP_401_UNAUTHORIZED)
        
        return Response({
            'error': 'Username and password required'
        }, status=status.HTTP_400_BAD_REQUEST)


class TrainingProgramListCreateView(generics.ListCreateAPIView):
    """List training programs and create new program"""
    serializer_class = TrainingProgramSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return TrainingProgram.objects.filter(provider=self.request.user)

    def perform_create(self, serializer):
        serializer.save(provider=self.request.user)


class TrainingProgramDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, or delete a specific training program"""
    serializer_class = TrainingProgramSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return TrainingProgram.objects.filter(provider=self.request.user)


class TrainingEnrollmentListView(generics.ListAPIView):
    """List enrollments for provider's programs"""
    serializer_class = TrainingEnrollmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return TrainingEnrollment.objects.filter(program__provider=self.request.user)


class TrainingEnrollmentDetailView(generics.RetrieveUpdateAPIView):
    """Get and update enrollment details"""
    serializer_class = TrainingEnrollmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return TrainingEnrollment.objects.filter(program__provider=self.request.user)


class InternshipListCreateView(generics.ListCreateAPIView):
    """List internships and create new internship"""
    serializer_class = InternshipSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Internship.objects.filter(provider=self.request.user)

    def perform_create(self, serializer):
        serializer.save(provider=self.request.user)


class InternshipDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, or delete a specific internship"""
    serializer_class = InternshipSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Internship.objects.filter(provider=self.request.user)


class PlacementListCreateView(generics.ListCreateAPIView):
    """List placements and create new placement"""
    serializer_class = PlacementSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Placement.objects.filter(training_program__provider=self.request.user)


class PlacementDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, or delete a specific placement"""
    serializer_class = PlacementSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Placement.objects.filter(training_program__provider=self.request.user)
