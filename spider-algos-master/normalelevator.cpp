// normal mode
#include<bits/stdc++.h>
using namespace std;
// binarysearch for insertion position of element
int search(int arr[],int l,int r,int start)
{
	int m = (l + r) / 2;	
	if(l != m)
	{
		if(arr[m] > start )
		{
			search(arr, l, m, start)	;
		}
		else if(arr[m] < start )
		{
			search(arr, m + 1, r, start)	;
		}
		else if(arr[m] == start)
		{
			return m;
		}
    }  
	else return l;
}


int main()
{
	int n = 0,i,j,temp,start;
	
	int arr[1000];
	char c='\0';
	
	//	input starting floor 
	cin>>start;

	do{
        scanf("%d%c", &arr[n], &c);
        n++; 
        } while(c!= '\n');

	
  	sort(arr,arr+n);
  	
//	searching the position of element   
  	temp=search(arr,0,n-1,start);
  	
//  outputting the required answer
  	cout<<start<<" ";
	for(i = temp + 1; i < n; ++i)
		{
			cout<<arr[i]<<" ";		
		}
	for(i=temp;i>=0;i--)
		{
	 		cout<<arr[i]<<" ";
		}
	 
	 int d = 2 * (arr[n - 1] - start) + (start - arr[0]);
	 cout<<endl<<"Total Distance: "<<d;
}
