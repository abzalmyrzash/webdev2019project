from rest_framework.views import APIView
from django.http import JsonResponse,HttpResponse
from rest_framework.response import Response
from rest_framework import status
from api.serializers import PostSerializer
from rest_framework.views import APIView
from rest_framework import mixins
from rest_framework import generics
from api.models import Group,Post

class GroupPostView(APIView):
    def get(self,request,pk):
        posts=Post.objects.filter(group_id=pk)
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request,pk):
        serializer = PostSerializer(data=request.data)
        serializer.group_id=pk
        if serializer.is_valid():
            serializer.save(created_by=self.request.user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
